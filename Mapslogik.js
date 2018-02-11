var mapProp;
    	var directionsService;
      var directionsDisplay;
      var map;
      var counter;
      var x,y;



      function initMap() {
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        navigator.geolocation.getCurrentPosition(
          function (position) {
     				x = position.coords.latitude;
     				y = position.coords.longitude;
     				mapProp = {
     						zoom : 15,
     						center : {lat : x, lng:y}
     					}
              calculateAndDisplayRoute(directionsService, directionsDisplay);
          });

        map = new google.maps.Map(document.getElementById('map'), mapProp);
        directionsDisplay.setMap(map);




 		  }

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin : mapProp.center.lat+','+mapProp.center.lng,
          destination : '52.492475400910344, 13.445162773132324',
          travelMode: 'WALKING'
        }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
              showSteps(response);
            } else {
                window.alert('Directions request failed due to ' + status);
              }
          });
      }


      function showSteps(directionResult) {
        var myRoute = directionResult.routes[0].legs[0];
        counter = 1;
        var distance = function(lat1, lon1, lat2, lon2) {
                        var p = 0.017453292519943295;    // Math.PI / 180
                        var c = Math.cos;
                        var a = 0.5 - c((lat2 - lat1) * p)/2 +
                                c(lat1 * p) * c(lat2 * p) *
                                (1 - c((lon2 - lon1) * p))/2;

          return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        }


        var manipulateSpeak = function (text) {

          var correct = "";
          var TagState = true;
          for (var i = 0; i < text.length; i++) {

            if (text[i] == "<" ) {
              TagState = false;
            }

            if (TagState) {
              correct = correct + text[i];
            }

            if (text[i] == ">") {
              TagState = true;
            }


          }

          return correct;
        };




         setInterval(function () {
            var lat1 = myRoute.steps[counter].end_location.lat(); //lat 1 = EndLat of the next Step
            var lon1 = myRoute.steps[counter].end_location.lng(); // lon1 = EndLng of the next Step
            navigator.geolocation.getCurrentPosition(
              function (position) {
                x = position.coords.latitude;
                y = position.coords.longitude;
              });
            var lat2 = x;
            var lon2 = y;

            var d = Math.round(distance(lat1,lon1,lat2,lon2)*1000); // in Metern

            var text = myRoute.steps[counter].instructions;

            responsiveVoice.speak("In "+ d +" Metern "+ manipulateSpeak(text),"Deutsch Female");



            }
            ,8000)
      }
