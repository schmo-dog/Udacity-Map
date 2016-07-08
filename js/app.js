$(function() {
    function AppViewModel() {

        var self = this;
        var map;
        var marker;

        var items = [{ lat: 44.7631, lng: -85.6206, Name: 'Traverse City' },
            { lat: 44.8977, lng: -85.9889, Name: 'Glen Arbor', },
            { lat: 44.8111, lng: -86.0601, Name: 'Empire', },
            { lat: 44.8840923, lng: -86.04773089999998, Name: 'Sleeping Bear Dunes', },
            { lat: 44.5536, lng: -86.2145, Name: 'Watervale', },
        ];

        locations = ko.observableArray();

        // Create the Google Map
        var traverseCity = { lat: 44.819940, lng: -85.813971 };

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: traverseCity,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        // loop through array then build markers
        for (var i = 0; i < items.length; ++i) {

            var name = items[i].Name;
            var location = items[i];
            var position = {
                lat: location.lat,
                lng: location.lng
            };
            var lat = location.lat;
            var lng = location.lng;

            // create the markers, add them to their respective object in array
            items[i].mapMarker = new google.maps.Marker({
                position: position,
                map: map,
                label: name,
                title: name,
                animation: google.maps.Animation.DROP

            });

            useInfo(items[i].mapMarker, name, lat, lng);
        }

        // build info window for the title of each marker
        function useInfo(marker, title, lat, lng) {
            var infowindow = new google.maps.InfoWindow({
                content: title
            });

            // create listener when clicking on specific marker and do stuff
            marker.addListener('click', function() {
                infowindow.open(marker.get('map'), marker);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() { marker.setAnimation(null); }, 750);

                // pass marker info to Foursquare function and run it
                loadData(lat, lng, title);
            });
        }

        // Filter List with input box
        // note- cities is the ul list in the sidebar
        cities = ko.computed(function() {

            /* These logs show that the markers have been
            created and assigned to array before the filter runs and shows
            that the visible property on the mapMarker is updated accordingly
            */
            console.log(items);
            console.log('*-filter has been run-*');

            // what is currently in the imput field
            var currentContent = locations();

            /* This will filter the cities list and will change the visible property
              on each marker object within the array.

            NOTE - This is where I need the help. I need to call the map again and tell
            it that the visiblity properties have now changed again.
            */
            return items.filter(function(i) {

                var filteredArray = i.Name.toLowerCase().indexOf(currentContent) >= 0;

                if (filteredArray === true) {
                    i.mapMarker.visible = true;
                } else {
                    i.mapMarker.visible = false;
                }
                return filteredArray;
            });
        });

        // Load Forquare API
        function loadData(lat, lng, title) {

            var latitude = lat;
            var longitude = lng;
            var locationName = title;
            var $foursquare = $('#foursquare');
            var $foursquareArticles = $('#foursquare-articles');
            var $foursquareHeaderElem = $('#foursquare-header');

            // clear out old data before new request
            $foursquareArticles.text('');

            $foursquareHeaderElem.text('Nearby venue suggestions for ' + locationName + ' provided by Foursquare');

            var $squareURL = 'https://api.foursquare.com/v2/venues/explore?client_id=DTSUJ5OJDHAHM3JCPZFIZU2GPSXBVVEVHDPIHKYKEPKOD3FM&client_secret=APWZMZEBYMYKHN20UX1N3CDMXU430NRGZFO3Z5DVBLTIUGVL&v=20130815&ll=' + latitude + ',' + longitude + '&limit=5';

            // make call to Foursquare
            $.getJSON($squareURL, function(data) {

                venues = data.response.groups[0].items;

                for (var i = 0; i < venues.length; i++) {
                    var location = venues[i];
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

    // Functionality to toggle menu bar when in mobile view
    $(".navbar-toggle").on('click', function() {
        $('.sidebar').toggleClass('show');
    });
});
