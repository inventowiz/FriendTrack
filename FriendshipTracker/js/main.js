function getLocation(){
	console.log("Begin getLocation");
if(google.loader.ClientLocation){
    var visitor_lat = google.loader.ClientLocation.latitude;
    var visitor_lon = google.loader.ClientLocation.longitude;
    var visitor_city = google.loader.ClientLocation.address.city;
    var visitor_region = google.loader.ClientLocation.address.region;
    var visitor_country = google.loader.ClientLocation.address.country;
    var visitor_countrycode = google.loader.ClientLocation.address.country_code;
    console.log(visitor_city + ", " + visitor_country);
    alert(visitor_city + ", " + visitor_country);
}
else{
	console.log("Location not found");
}
}

function addUser(){
	var response;
	
	Parse.Cloud.run('addUser', {fb_id: 637582791}, {
		success: function(response){
			console.log("response: " + response);
			console.log(response.fb_id);
		}
	});
}
