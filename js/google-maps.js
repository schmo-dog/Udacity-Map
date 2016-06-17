// Google Maps

// var map;
// var markers = [{ lat: 44.7631, lng: -85.6206, Name: 'Traverse city' },
//      { lat: 44.8977, lng: -85.9889, Name: 'Glen Arbor' },
//      { lat: 44.8111, lng: -86.0601, Name: 'Empire' },
//      { lat: 44.8840923, lng: -86.04773089999998, Name: 'Sleeping Bear Dunes' },
//      { lat: 44.5536, lng: -86.2145, Name: 'Watervale'},
//     { lat: 45.0187, lng: -86.1334, Name: 'Soulth Manitou Island' }
// ];

// // Initialize Map
// function initMap() {
//     var traverseCity = { lat: 44.819940, lng: -85.813971 };

//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 9,
//         center: traverseCity,
//         mapTypeId: google.maps.MapTypeId.TERRAIN
//     });

//    placeMarkers();

// }

// // Place on init and update markers when list has been filtered. Will need to be called when time comes. To be inplemented.
// function placeMarkers() {

//     var newMarkers = [];
    
//     for (var j = 0;  j < markers.length; j++) {

//         newMarkers.push({ lat: markers[j].lat, lng: markers[j].lng });
//     }

//     for (var i = 0; i < newMarkers.length; i++) {
//         //var lat = markers[i].lat;
//         // var lng = markers[i].lng;
//         // var location = '{' + lat + ',' + lng + '}';
//         // console.log(lat);

//         var marker = new google.maps.Marker({
//             position: newMarkers[i],
//             map: map
//                 //title: markers[i].title
//         });
//     }
// }

//placeMarkers();

// Shows that it will load after a set delay.
//setTimeout(function(){ placeMarkers(); }, 3000);







