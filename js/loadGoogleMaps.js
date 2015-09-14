
function initialize() {
var mapProp = {
  center:new google.maps.LatLng(52.1333,-106.6833),
  zoom:11,
  mapTypeId:google.maps.MapTypeId.ROADMAP
};
var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}
google.maps.event.addDomListener(window, 'load', initialize);