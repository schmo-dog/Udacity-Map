function AppViewModel() {

    var self = this,
        map,
        marker,
        items = [{ lat: 44.7631, lng: -85.6206, Name: 'Traverse City' },
            { lat: 44.8977, lng: -85.9889, Name: 'Glen Arbor' },
            { lat: 44.8111, lng: -86.0601, Name: 'Empire' },
            { lat: 44.8840923, lng: -86.04773089999998, Name: 'Sleeping Bear Dunes' },
            { lat: 44.5536, lng: -86.2145, Name: 'Watervale' },
        ];

    self.locations = ko.observable('');
    self.showFoursquare = ko.observable(false);
    self.foursquareHeaderMessage = ko.observable();
    self.foursquareVenues = ko.observableArray();

    // Create the Google Map
    var infowindow = new google.maps.InfoWindow({}),
        traverseCity = { lat: 44.819940, lng: -85.813971 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: traverseCity,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    // loop through items array then build markers
    for (var i = 0; i < items.length; ++i) {

        var name = items[i].Name,
            location = items[i],
            position = {
                lat: location.lat,
                lng: location.lng
            },
            lat = location.lat,
            lng = location.lng;

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

    function useInfo(marker, title, lat, lng) {
        // create listener when clicking on specific marker and do stuff
        marker.addListener('click', function() {
            infowindow.setContent(title);
            infowindow.open(marker.get('map'), marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() { marker.setAnimation(null); }, 1400);
            map.panTo(marker.getPosition());
            // pass marker info to Foursquare API function
            loadData(lat, lng, title);
        });
    }

    // when a specific location in the list has been clicked
    self.listItemClick = function(marker) {
        var theMarker = marker.mapMarker;
        new google.maps.event.trigger(theMarker, 'click');
    };

    // flter list with the input box
    cities = ko.computed(function() {

        // close any marker info windows
        infowindow.close();

        // what is currently in the imput field
        var currentContent = self.locations().toLowerCase();

        // hide Foursquare div when filter imput field is empty
        if (currentContent.length === 0) {
            self.showFoursquare(false);
        }

        return items.filter(function(i) {

            var filteredArray = i.Name.toLowerCase().indexOf(currentContent) >= 0;
            // Set the visiblity of the markers depending if they are in the filtered list
            if (filteredArray) {
                i.mapMarker.setVisible(true);
            } else {
                i.mapMarker.setVisible(false);
            }
            return filteredArray;
        });
    });

    // Load Forquare API
    function loadData(lat, lng, title) {

        var latitude = lat,
            longitude = lng,
            locationName = title;

        self.showFoursquare(true);
        self.foursquareHeaderMessage("Nearby venue suggestions for " + locationName + " provided by Foursquare");
        // clear out existing array contents
        self.foursquareVenues.removeAll();

        var squareURL = 'https://api.foursquare.com/v2/venues/explore?client_id=DTSUJ5OJDHAHM3JCPZFIZU2GPSXBVVEVHDPIHKYKEPKOD3FM&client_secret=APWZMZEBYMYKHN20UX1N3CDMXU430NRGZFO3Z5DVBLTIUGVL&v=20130815&ll=' + latitude + ',' + longitude + '&limit=5';

        // make call to Foursquare
        $.getJSON(squareURL, function(data) {
            var venues = data.response.groups[0].items;
            for (var i = 0; i < venues.length; i++) {
                var location = venues[i];

                self.foursquareVenues.push({
                    venueName: location.venue.name,
                    category: location.venue.categories[0].name,
                    rating: location.venue.rating
                });

            }

        }).fail(function() {
            self.foursquareHeaderMessage('Foursquare information could not be loaded at this time. Please try again later.');
        });
        return false;
    }
}

// load Google Map asynchronously then load viewModel
function googleSuccess() {
    ko.applyBindings(new AppViewModel());
}

// fallback error handeling for Google Maps
function googleError() {
    alert('Oops, Google Maps did not load properly. See the browser console for details.');
}

// menu funtionality in mobile view
var $sidebar = $('.sidebar');

$(".navbar-toggle").on('click', function() {
    $sidebar.toggleClass('show');
});

$(".specific-location").on('click', function() {
    if ($sidebar.hasClass('show')) {
        $sidebar.toggleClass('show');
    }
});
