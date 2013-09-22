///////////////////////////////////
//////CLOUD FUNCTION SECTION
///////////////////////////////////

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
	newuser.set("join_date",new Date());
	newuser.save(null,{
		error: function(newuser,error){
			response.error("Saving screwed up somewhere.");
		},
		success: function(newuser){
			response.success("User: " + newuser.get("fb_id") + " was added successfully.");
		}
	});
});

Parse.Cloud.define("addTuple",function(request,response){
	var Tuple = Parse.Object.extend("friend_tuple");
	var User = Parse.Object.extend("trakr_user");
	var newtuple = new Tuple();
	var userQuery = new Parse.Query(User);
	
	newtuple.save(request.params);
	userQuery.equalTo("fb_id",request.params.fb_id);
	userQuery.count({
		success: function(result){
			if(result > 0)
				newtuple.save({friend_is_user:1});
			else
				newtuple.save({friend_is_user:0});
			response.success("Successfully added tuple with params: " + request.params);
		},
		error: function(error){
			response.error("Something in our query went wrong");
		}
	});
});

Parse.Cloud.define("updateTuple",function(request,response){
	//request should contain friend_id, user_id, and value
	var Tuple = Parse.Object.extend("friend_tuple"); //init the helloworld class
	var query = new Parse.Query(Tuple); //create query class to search the helloworld class
	
	query.equalTo("user_id", request.params.user_id); //all tuples with the specified user_id
	query.find({
		success: function(results){ //linear search through the small amount of tuples
			//do something with what we found
			for (var i = 0; i < results.length; i++) { 
				if(results[i].get("friend_id") === request.params.friend_id){
					var object = results[i];
					object.increment("friend_percent",request.params.value);
					object.save();
					status.success("Edited tuple (user:" + object.get("user_id") + ", friend:" + object.get("friend_id") + " with a change of " + request.params.value);
					break;
				}
			}
		},
		error: function(error){
			status.error("Query broke in finding your request");
		}
	});

});

///////////////////////////////////
//////JOBS SECTION
//////////////////////////////////

Parse.Cloud.job("dec_friendship_percents", function(request,status){
	var Tuple = Parse.Object.extend("friend_tuple"); //init the helloworld class
	var query = new Parse.Query(Tuple); //create query class to search the helloworld class
	
	query.greaterThan("friend_percent", 0); //all tuples with %>0
	query.find({
		success: function(results){
			//do something with what we found
			for (var i = 0; i < results.length; i++) { 
			  var object = results[i];
			  object.increment("friend_percent",-1);
			  object.save();
			}
			status.success("Successfully decremented " + results.length + " tuples.");
		},
		error: function(error){
			status.error("Query broke in friend_percent finding");
		}
	});
});
