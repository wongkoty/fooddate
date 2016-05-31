var testRoute = require("../controller/yelpAPI.js");

//BASE MAPS STYLED MAPS SATELLITE DIRECTIONS MARKERS
function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: false,
    zoom: 8
  });
  console.log("does this print " + doesThisPrint);
}