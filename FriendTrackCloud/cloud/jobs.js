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
			}
			status.success("Successfully decremented " + results.length + " tuples.");
		},
		error: function(error){
			status.error("Query broke in friend_percent finding");
		}
	});
});