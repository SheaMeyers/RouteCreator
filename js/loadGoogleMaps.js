
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('GoogleMap'), {
    center: {lat: 52.1333, lng: -106.6833},
    zoom: 11
  });
}