'use strict';
// phone mask
(function () {
  var selector = document.getElementById("phone-number");
  var phoneMask = new Inputmask("+7 (999) 999 - 99 - 99");
  phoneMask.mask(selector);
})();

// email check
(function () {
  var validateEmail = function (inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    inputText.setCustomValidity('');
    if(!inputText.value.match(mailformat)) {
      inputText.setCustomValidity("Неверный email");
    }
  };

  var emailInput = document.getElementById("email");

  emailInput.addEventListener('input', function () {
    validateEmail(emailInput);
  })
}) ();

// calendar
$('#date-of-birth').datepicker({
  dateFormat: 'dd / mm / yyyy'
});

// google maps
function initMap() {
  var mapOptions = {
    zoom: 13,
    center: {lat: 59.939722, lng: 30.332004}
  }
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var markers = [];
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  var clickCoordinate = '';

  google.maps.event.addListener(map, 'click', function(event) {
    clickCoordinate = event.latLng.lat() + "," + event.latLng.lng();

    geocodeLatLng(geocoder, map, infowindow, clickCoordinate);
  });

  function setMapOnAll(map) {
    markers.forEach(function (marker) {
      marker.setMap(map);
    });
  }

  function geocodeLatLng(geocoder, map, infowindow, coordinate) {
    var input = document.getElementById('address');
    var latlngStr = coordinate.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          map.setZoom(16);
          setMapOnAll(null);
          input.value = '';

          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });

          markers.push(marker);
          infowindow.setContent(results[0].formatted_address);
          input.value = results[0].formatted_address;
          input.setAttribute('value', results[0].formatted_address);
          infowindow.open(map, marker);

        } else {
          window.alert('No results found');

        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  window.script = {
    markers: markers,
    map: map,
    clearMarker: setMapOnAll
  };
};
