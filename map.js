
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

function getEndDateTime(date) {
    return date.setHours(18);
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
    const endDateTime = getEndDateTime(date);
    let currentDateTime = new Date(getStartDateTime(date));
console.log(parsedList);

    while(new Date(currentDateTime.addHours(2)) < new Date(endDateTime)){
        for(let i =0; i<= parsedList.length; i++){
            const currentPlace = parsedList[i];
            if(currentPlace !== undefined && isPlaceOpen(currentPlace,currentDateTime)) {
                result.push(currentPlace);
                delete parsedList[i];
            }
        }
    }
console.log(parsedList);
    return result;
}

function parseList(listOflistsOfPlaces) {
    let ids = [];
    return listOflistsOfPlaces.reduce((list,listOfPlaces) => {
        listOfPlaces.forEach(currentPlace=> {
            if (!ids.includes(currentPlace.id)) {
                list.push(currentPlace);
                ids.push(currentPlace.id);
            }
        });
        return list;
    },[])
}

function getTrip(listOfPlaces, dates){
    // listOfPlaces = [[{
    // id: },{},...],[{},{},...],...]
    // dates = [date1,date2,...]
console.log(listOfPlaces);
    const parsedList = parseList(listOfPlaces);
    let result = [];
    dates.forEach(date => {
        result.push(getDayOfTrip(parsedList,date));
    });
    console.log(result);
    return result;
}

let places = [];

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
places = [];
//types.map(type=>nearbySearch(service,bounds,type));
let promises = types.map(type=>nearbySearch(service,bounds,type));
//Promise.all(promises

getTrip(places,[new Date()]);
//console.log(types);

      //createMarker(myResult);

      map.setCenter(myResult);

      map.setZoom(17);
		}
	});

}

function nearbySearch(service,bounds,type){
	//service.nearbySearch({
          //bounds: bounds,
         // type: [type]
       // }, callback);

return new Promise(function(resolve,reject) {
	service.nearbySearch({
		bounds: bounds,
		type: [type],
	},(results,status)=>{
		if (status == google.maps.GeocoderStatus.OK) {
        // resolve results upon a successful status
        		console.log(results);
			return results;
      		} else {
        // reject status upon un-successful status
        		reject(status);
      		}
	})
}



function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
	//console.log(results);
          //for (var i = 0; i < results.length; i++) {
           // createMarker(results[i]);
          //}
	places.push(results);
return results;
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

