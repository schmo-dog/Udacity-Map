// Knockout viewModel
var viewModel = {
    items: [{ lat: 44.7631, lng: -85.6206, Name: 'Traverse City', visible: true, mapMarker: {} },
        { lat: 44.8977, lng: -85.9889, Name: 'Glen Arbor', visible: true, mapMarker: {} },
        { lat: 44.8111, lng: -86.0601, Name: 'Empire', visible: true, mapMarker: {} },
        { lat: 44.8840923, lng: -86.04773089999998, Name: 'Sleeping Bear Dunes', visible: true, mapMarker: {} },
        { lat: 44.5536, lng: -86.2145, Name: 'Watervale', visible: true, mapMarker: {} },
    ]
};

viewModel.locations = ko.observableArray();

// Filter List
viewModel.locationResults = ko.computed(function() {
    console.log('filter has been run');
    // Current input box
    var currentContent = viewModel.locations();
    // Filtering items array
    return viewModel.items.filter(function(i) {

        var filteredArray = i.Name.toLowerCase().indexOf(currentContent) >= 0;
        //var visibleMarker = i.visible;
        // console.log(visibleMarker);
        //console.log(viewModel.items[i]);
        if (filteredArray === true) {
            i.mapMarker.visible = true;
        } else {
            i.mapMarker.visible = false;
        }

        // Run the set visiblity function
        //setVisibility();
        //console.log(filteredArray);
        //console.log(visibleMarker);
        //console.log(viewModel.items);
        return filteredArray;
    });

});

// Create the Google Map
var map;
var marker;

function initMap() {
    var traverseCity = { lat: 44.819940, lng: -85.813971 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: traverseCity,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    for (var i = 0; i < viewModel.items.length; ++i) {

        var name = viewModel.items[i].Name;
        var locations = viewModel.items[i];
        var position = {
            lat: locations.lat,
            lng: locations.lng
        };
        var lat = locations.lat;
        var lng = locations.lng;
        //var location = [];

        // Create the markers
        locations.mapMarker = new google.maps.Marker({
            position: position,
            map: map,
            label: name,
            title: name,
            animation: google.maps.Animation.DROP
        });

        //console.log(locations);
        // console.log(marker.title);
        //console.log(viewModel.items[1]);
        //console.log(location);

        useInfo(locations.mapMarker, name, lat, lng);
    }
}


function useInfo(marker, title, lat, lng) {
    var infowindow = new google.maps.InfoWindow({
        content: title
    });

    marker.addListener('click', function() {
        infowindow.open(marker.get('map'), marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { marker.setAnimation(null); }, 750);

        // pass marker info to yelp function and run
        loadData(lat, lng, title);
    });

    //console.log(marker);

}


// function setVisibility() {

//     for (var i = 0; i < viewModel.items.length; i++) {

//         //var isVisible = viewModel.items[i].visible;
//         console.log(viewModel.item[i]);
//         // Need to reference marker variable
//         //marker.setVisible(isVisible);
//         if (viewModel.items[i].visible === true) {
//             viewModel.items[i].mapMarker.visible = false;
//         } else {
//             viewModel.items[i].mapMarker.visible = true;
//         }

//     }

// }


// Yelp Code
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

    // load yelp
    var $squareURL = 'https://api.foursquare.com/v2/venues/explore?client_id=DTSUJ5OJDHAHM3JCPZFIZU2GPSXBVVEVHDPIHKYKEPKOD3FM&client_secret=APWZMZEBYMYKHN20UX1N3CDMXU430NRGZFO3Z5DVBLTIUGVL&v=20130815&ll=' + latitude + ',' + longitude + '&limit=5';

    $.getJSON($squareURL, function(data) {

        venues = data.response.groups[0].items;

        //console.log(venues.length);
        for (var i = 0; i < venues.length; i++) {
            var location = venues[i];
            //  console.log(location.venue);
            $foursquareArticles.append('<li class="article">' +
                // '<a target="_blank" href="' + location.venue.url + '">' + location.venue.name + '</a>' +
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

ko.applyBindings(viewModel);
