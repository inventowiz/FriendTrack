///////////////////////////////////
//////CLOUD FUNCTION SECTION
///////////////////////////////////


// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("userExists",function(request,response){
	var User = Parse.Object.extend("trakr_user");
	var userQuery = new Parse.Query(User);
	
	userQuery.equalTo("fb_id",request.params.fb_id);
	userQuery.count({
		success: function(result){
			//do something with what we found
			if(result === 0)
				response.success(0);
			else
				response.success(1);
		},
		error: function(error){
			response.error("Something went wrong");
		}
	});
});

Parse.Cloud.define("addUser",function(request,response){
	var User = Parse.Object.extend("trakr_user");
	var newuser = new User();
	
	newuser.set("fb_id",request.params.fb_id);
	newuser.set("friends",[]);
	newuser.save(null,{
		error: function(newuser,error){
			response.error("Saving screwed up somewhere.");
		},
		success: function(newuser){
			response.success("User: " + newuser.get("fb_id") + " was added successfully.");
		}
	});
	response.error("User: " + request.params.fb_id + " was NOT added successfully.");
	});
	
	newuser.set("fb_id",request.params.fb_id);
	newuser.set("friends",[]);
	newuser.save(null,{
		error: function(newuser,error){
			response.error("Saving screwed up somewhere.");
		},
		success: function(newuser){
			response.success("User: " + newuser.get("fb_id") + " was added successfully.");
		}
	});
	response.success("User: " + request.params.fb_id + " was added successfully.");
});

Parse.Cloud.define("addFriendToUser",function(request,response){
	var User = Parse.Object.extend("trakr_user");
	var friend = Parse.Object.extend("friend");
	var userQuery = new Parse.Query(User);
	
	var newfriend = new friend();
	
	newfriend.set("User",request.params.user_id);
	newfriend.set("fb_id",request.params.fb_id);
	newfriend.set("friend_percent",50);
	newfriend.set("last_contacted", new Date("today"));
	newfriend.save();
	
	query.equalTo("fb_id",request.params.user_id);
	query.find({
		success: function(results){
			//do something with what we found
			if(results.length() === 0)
				response.error("nothing found for user_id=" + request.params.user_id);
			var user = results[0]; //just take the first one found
			var friendarr = user.get("friends"); //should be an array of fb_ids
			friendarr.push(newfriend.get("fb_id"));
			response.success("newfriend: " + newfriend.get("fb_id") + " added to UserID: " + user.get("fb_id"));
		},
		error: function(error){
			response.error("Something went wrong.");
		}
	});
	
});

///////////////////////////////////
//////JOBS SECTION
///////////////////////////////////

Parse.Cloud.job("helloworldinit", function(request,status){
	var helloworld = Parse.Object.extend("helloworld"); //created an init of the helloworld class
	var foobar = new helloworld(); //make foobar our working var
	
	foobar.set("count", 15);
	foobar.set("name", "test15");
	
	foobar.save(null, {
		success: function(foobar){
			//do this after we're saved.
		},
		error: function(foobar,error){
			//do this on error saving
			alert("There was an error saving your new data to Parse. ID:" + foobar.id);
		}
	}); // end save
	status.success("reset test15 to 15");
});

Parse.Cloud.job("helloworlddec", function(request,status){
	var helloworld = Parse.Object.extend("helloworld"); //init the helloworld class
	var query = new Parse.Query(helloworld); //create query class to search the helloworld class
	
	query.equalTo("name","test15");
	query.find({
		success: function(results){
			//do something with what we found
			var test15 = results[0]; //just take the first one found
			if(test15.get("count") === 0)
				test15.set("count", 15);
			else
				test15.increment("count",-1);
			test15.save();
			status.success("test15 count updated to: " + test15.get("count"));
		},
		error: function(error){
			status.error("nothing found for test15");
		}
	});
});

