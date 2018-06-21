var map;

function initMap() {
        map = new google.maps.Map(document.getElementById(
        'map'), {
        center: {
            lat: 17.4065,
            lng: 78.5505
        },
        
    });

// location having the characteristics like name and data.
var Location = function(data) {
    this.name = data.name;
    this.location = data.location;
};

//Where all the controlling takes palce
var ViewModel = function() {
    var me = this;

    
    this.locationList = ko.observableArray([]);
    this.filter = ko.observable();

    //looping through each item in places and
    //adding it to the array
    places.forEach(function(
        locationItem) {
        me.locationList.push(new Location(
            locationItem));
    });

    var largeInfoWindow = new google.maps
        .InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    me.locationList().forEach(function(
        location) {
        // define the marker
        var marker = new google.maps.Marker({
            map: map,
            position: location.location,
            name: location.name,
            animation: google.maps.Animation
                .DROP
        });

        location.marker = marker;


        //onclick event to open infoWindow
        //updated to also toggleBounce
        //Atribution: Udacity's Google Maps APIS Course
        location.marker.addListener(
            'click',
            function() {
                populateInfoWindow(this,
                    largeInfoWindow);
                toggleBounce(this);
            });

        bounds.extend(location.marker.position);

    });

    map.fitBounds(bounds);


    
    //bounce when location is clicked
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            for (var i = 0; i < me.locationList()
                .length; i++) {
                var mark = me.locationList()[i].marker;
                if (mark.getAnimation() !== null) {
                    mark.setAnimation(null);
                }
            }
            marker.setAnimation(google.maps.Animation
                .BOUNCE);
        }
    }
    this.currentLocation = ko.observable(
        this.locationList()[0]);


	this.filteredLocations = ko.computed(
        function() {
            var filter = me.filter();
            if (!me.filter()) {
                me.locationList().forEach(
                    function(location) {
                        location.marker.setMap(map);
                    });
                return me.locationList();
            } else {
                return ko.utils.arrayFilter(me.locationList(),
                    function(loc) {
                        if (loc.name.toLowerCase().indexOf(
                                filter.toLowerCase()) !== -1) {
                            loc.marker.setMap(map);
                        } else {
                            loc.marker.setMap(null);
                        }
                        return loc.name.toLowerCase()
                            .indexOf(filter.toLowerCase()) !==
                            -1;
                    });
            }
        }, me);


    //shows the details of location
    this.setLocation = function(
        clickedLocation) {
        toggleBounce(clickedLocation.marker);
        populateInfoWindow(clickedLocation.marker,
            largeInfoWindow);
        me.currentLocation(
            clickedLocation);
    };
};

    var center;

    function calculateCenter() {
        center = map.getCenter();
    }
    google.maps.event.addDomListener(map,
        'idle',
        function() {
            calculateCenter();
        });
    google.maps.event.addDomListener(
        window, 'resize',
        function() {
            map.setCenter(center);
        });

    ko.applyBindings(new ViewModel());
}
var places = [{
    name: 'Falaknuma Palace',
    location: {
        lat: 17.3313295,
        lng: 78.4661712
    }
}, {
    name: 'Marriott International',
    location: {
        lat: 17.424608,
        lng: 78.4868128
    }
}, {
    name: 'Park Hyatt Hyderabad',
    location: {
        lat: 17.4247173,
        lng: 78.4295972
    }
}, {
    name: 'Westin Hotels & Resorts',
    location: {
        lat: 17.3579424,
        lng: 78.2726995
    }
}, {
    name: 'Radisson Blu',
    location: {
        lat: 17.4222385,
        lng: 78.4465643
    }
}, {
    name: 'Avasa',
    location: {
        lat: 17.4470251,
        lng: 78.3814943
    }
}];


//Function occurs when error in api and displays the data in info window.
function googleErrorHandler() {
    $('#map-error').html(
        '<h3>Error in google maps api</h3>'
    );
}
function populateInfoWindow(marker,
    infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        //Api for wikipedia used to know info about every hotel.
        var wikiUrl =
            'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
            marker.name +
            '&format=json&callback=wikiCallback';

        var wikiRequestTimeout = setTimeout(
            function() {
                infowindow.setContent(
                    "failed to get wikipedia resources"
                );
            }, 800);

        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp'
        }).done(function(response) {
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
                var articleStr = articleList[i];
                var url =
                    'https://www.wikipedia.org/wiki/' +
                    articleStr;
                infowindow.setContent('<div><p>Wiki Info: <a href="' +
                    url + '">' + articleStr +
                    '</a></p></div>');
            }

            clearTimeout(wikiRequestTimeout);
        });

        infowindow.open(map, marker);

        infowindow.addListener('closeclick',
            function() {
                infowindow.close();
                marker.setAnimation(null);
            });
    }
}

var main = document.querySelector(
    '.main');
var drawer = document.querySelector(
    '#drawer');

this.openMenu = function() {
    drawer.classList.toggle('open');
    main.classList.toggle('moveRight');
};
