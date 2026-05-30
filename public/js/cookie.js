// Save user session.
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",expires=" + date.toGMTString();
}

// Used on the tether.html page for reading and loading the user session and 
// executes when the document's DOM finishes loading. Prevents users that are  
// not signed in from accessing tether.html. 
function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	// Example splits array:
	// ["firstName=John", "lastName=Smith", "userId=5", "expires=..."]
	for(var i = 0; i < splits.length; i++) 
	{
		let cookieKeyValue = splits[i].trim();

		// Index 0 is the key, index 1 is the value.  
		let tokens = cookieKeyValue.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 ) // no valid user read from cookie
	{
		window.location.href = "index.html"; // send to landing page
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName + "!";
	}
}
