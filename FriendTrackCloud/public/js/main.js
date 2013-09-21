function getLocation() {
	console.log("Begin getLocation");
	$.get("http://ipinfo.io", function (response) {
	    console.log("IP: " + response.ip);
	    console.log("Location: " + response.city + ", " + response.region);
	    console.log(JSON.stringify(response, null, 4));
	}, "jsonp");
}

function addUser() {
	Parse.Cloud.run('userExists', {
		fb_id : 637582791
	}, {
		success : function(response) {
			console.log("response: " + response);			
			console.log("After userExists response: " + response);
			if (response === 0) {
				console.log("About to run addUser");
				Parse.Cloud.run('addUser', {
					fb_id : 637582791
				}, {
					success : function(response) {
						console.log("response: " + response);
						console.log(response.fb_id);
					}
				});
			}
		}
	});


}
