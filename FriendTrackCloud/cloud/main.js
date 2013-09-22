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

