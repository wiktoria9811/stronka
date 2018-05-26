
var map;
var marker;
var infoWindow;


function initialize() {

	var mapOptions = {
		center: new google.maps.LatLng(50,20),
		zoom: 5,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	google.maps.event.addDomListener(window, 'load', initialize);

}


function getStartDateTime(date) {
    return date.setHours(10);
}

function isPlaceOpen(currentPlace, currentDateTime) {
    return true; // true/false - isOpen
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}


function getDayOfTrip(parsedList,date) {
    let result = [];
    const startDateTime = getStartDateTime(date);
    const endDateTime = getEndDateTime(date);
    let currentDateTime = startDateTime;
    while(currentDateTime.addHours(2) < endDateTime){
        for(let i =0; i<= parsedList.length; i++){
            const currentPlace = parsedList[i];
            if(isPlaceOpen(currentPlace,currentDateTime)) {

            }
        }
    }
}

function parseList(listOfPlaces) {
    let ids = [];
    return listOfPlaces.reduce((list,currentPlace) => {
        if(!ids.includes(currentPlace.id)) {
            list.push(currentPlace);
            ids.push(currentPlace.id);
        }
        return list;
    },[])
}

function getTrip(listOfPlaces, dates){
    // listOfPlaces = [[{
    // id: },{},...],[{},{},...],...]
    // dates = [date1,date2,...]
    let parsedList = parseList(listOfPlaces);
    dates.forEach(date => {
        getDayOfTrip(parsedList,date);
    })
}



function searchAddress() {

	var addressInput = document.getElementById('address-input').value;

	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({address: addressInput}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {

      var myResult = results[0].geometry.location;
	var bounds = results[0].geometry.bounds;
        infowindow = new google.maps.InfoWindow();

var service = new google.maps.places.PlacesService(map);
	var types = ['art_gallery', 'church', 'castle', 'city_hall', 'zoo','museum','synagogue','hindu_temple'];

types.forEach(type=>nearbySearch(service,bounds,type));



      //createMarker(myResult);

      map.setCenter(myResult);

      map.setZoom(17);
		}
	});

}

function nearbySearch(service,bounds,type){
	service.nearbySearch({
          bounds: bounds,
          type: [type]
        }, callback);
}

function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
	console.log(results);
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: placeLoc
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }

