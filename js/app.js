function AppViewModel() {

    var self = this;
    var map;
    var marker;

    var items = [{ lat: 44.7631, lng: -85.6206, Name: 'Traverse City', mapMarker: {} },
        { lat: 44.8977, lng: -85.9889, Name: 'Glen Arbor', mapMarker: {} },
        { lat: 44.8111, lng: -86.0601, Name: 'Empire', mapMarker: {} },
        { lat: 44.8840923, lng: -86.04773089999998, Name: 'Sleeping Bear Dunes', mapMarker: {} },
        { lat: 44.5536, lng: -86.2145, Name: 'Watervale', mapMarker: {} },
    ];

    locations = ko.observableArray();

    // Create the Google Map
    initMap();

    // Filter list/ Place list sidebar
    place = ko.computed(function() {
        console.log('******------filter has been run------******');

        // Current input box
        var currentContent = locations();


        // Filtering items array
        return items.filter(function(i) {

            var filteredArray = i.Name.toLowerCase().indexOf(currentContent) >= 0;

            // console.log(visibleMarker);
            //console.log(filteredArray);


            // set the visible property of the markers object
            //console.log(filteredArray);
            console.log(i.mapMarker);
            if (filteredArray === true) {
                //  i.mapMarker.visible = true; 
                i.mapMarker.setMap(i.mapMarker.originalMap);

                console.log('Item- ' + i.Name + ' mapMarker visible property should be true and is ' + i.mapMarker.visible);
            } else if (filteredArray === false) {
                //i.mapMarker.visible = false; //mapMarker.originalMap set to null
                i.mapMarker.setMap(null);
                console.log('Item-  ' + i.Name + ' mapMarker visible property should be false and is ' + i.mapMarker.visible);
            }

            // TO DO: Tell Google Map the visible property value has changed.

            return filteredArray;
        });

    });

    function initMap() {
        var traverseCity = { lat: 44.819940, lng: -85.813971 };

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: traverseCity,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        for (var i = 0; i < items.length; ++i) {

            var name = items[i].Name;
            var location = items[i];
            var position = {
                lat: location.lat,
                lng: location.lng
            };
            var lat = location.lat;
            var lng = location.lng;

            // Create the markers, place them within the items array for reference
            items.mapMarker = new google.maps.Marker({
                position: position,
                map: map,
                originalMap: map,
                label: name,
                title: name,
                animation: google.maps.Animation.DROP
            });

            //console.log(locations);
            //console.log(marker.title);
            //console.log(viewModel.items[1]);
            //console.log(location);

            useInfo(items.mapMarker, name, lat, lng);
        }
    }


    function useInfo(marker, title, lat, lng) {
        var infowindow = new google.maps.InfoWindow({
            content: title
        });

        // click event listener
        marker.addListener('click', function() {
            infowindow.open(marker.get('map'), marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() { marker.setAnimation(null); }, 750);

            // pass marker info to Foursquare function and run
            loadData(lat, lng, title);
        });

        console.log(marker);
    }

    // Forsquare Code
    function loadData(lat, lng, title) {

        var latitude = lat;
        var longitude = lng;
        var locationName = title;
        //console.log(locationName);
        var $foursquare = $('#foursquare');
        var $foursquareArticles = $('#foursquare-articles');
        //var $foursquareLocation = $('#foursquare-header');
        var $foursquareHeaderElem = $('#foursquare-header');

        // clear out old data before new request
        $foursquareArticles.text('');

        $foursquareHeaderElem.text('Nearby venue suggestions for ' + locationName + ' provided by Foursquare');

        // load forsquare
        var $squareURL = 'https://api.foursquare.com/v2/venues/explore?client_id=DTSUJ5OJDHAHM3JCPZFIZU2GPSXBVVEVHDPIHKYKEPKOD3FM&client_secret=APWZMZEBYMYKHN20UX1N3CDMXU430NRGZFO3Z5DVBLTIUGVL&v=20130815&ll=' + latitude + ',' + longitude + '&limit=5';

        $.getJSON($squareURL, function(data) {

            venues = data.response.groups[0].items;

            //console.log(venues.length);
            for (var i = 0; i < venues.length; i++) {
                var location = venues[i];
                //  console.log(location.venue);
                $foursquareArticles.append('<li class="article">' +
                    '<h3>' + location.venue.name + '</h3>' +
                    '<p>' + 'Category: ' + location.venue.categories[0].name + '</p>' +
                    '<p>' + 'Rating: ' + location.venue.rating + '</p>' +
                    '</li>');
            }

        }).error(function(e) {
            $foursquareHeaderElem.text('Yelp information could not be Loaded at this time.');
        });

        return false;
    }
}



ko.applyBindings(new AppViewModel());


// Functionality for mobile menu bar
$(document).ready(function() {

    $(".navbar-toggle").on('click', function() {

        if ($('.sidebar').hasClass('show')) {
            $('.sidebar').removeClass('show');
        } else {
            $('.sidebar').addClass('show');
        }
    });
});
