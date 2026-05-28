// Literal Constants.
const urlBase = 'http://tetherbyzans.com/LAMPAPI';
const extension = 'php';

// User specific globals.
let userId = 0;
let firstName = "";
let lastName = "";

// Used for the (index.html) landing page login, id="loginButton".
function doLogin()
{
	// re-assign default values to the globals 
	userId = 0;
	firstName = "";
	lastName = "";
	
	// Get userLogin and userPassword input.
	let login = document.getElementById("userLogin").value;
	let password = document.getElementById("userPassword").value;
//	var hash = md5( password );
	
	// loginResult may not be viewable to the user on successful login...
	document.getElementById("loginResult").innerHTML = "";

	// Create JSON string.
	let temp = {userLogin:login,userPassword:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( temp );
	
	let url = urlBase + '/Login.' + extension;

	// Prepare an asynchronous request to Server using the Login.php script.
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true); 
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	// 
	try
	{
		// triggers function() script whenever the readyState of xhr changes.
		xhr.onreadystatechange = function() 
		{
			// readyState value 4: DONE - "The operation is complete".
			// status value 200: 200 OK - HTTP response status code.
			// See documentation: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
			if (this.readyState == 4 && this.status == 200) 
			{
				// JSON from returnWithInfo() from Login.php.
				let jsonObject = JSON.parse( xhr.responseText );
				
				userId = jsonObject.ID;
		
				// returnWithError() from Login.php: "ID":0 
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Username or Password is incorrect! Please try again.";
					return;
				}
		
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();
	
				// update url / enter the tether webapp
				window.location.href = "tether.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

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

// Called from the logoutButton on tether.html. Resets globals and cookie and 
// redirects user to index.html. 
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Called from the searchContactButton on tether.html. Populates the page with 
// the search results.
function searchColor()
{
	let searchText = document.getElementById("searchText").value;

	// empty contactSearchResult span on tether.html
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	// Create JSON string of teh search and the current user.
	let temp = {search:searchText,UserId:userId};
	let jsonPayload = JSON.stringify( temp );

	let url = urlBase + '/SearchContact.' + extension;
	
	// Asynchronous POST request using the SearchContact.php script.
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			// After successful request...
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved!";
				
				let jsonObject = JSON.parse( xhr.responseText );
				
				// Loop through results array. 
				// See returnWithInfo() in SearchContact.php.
				for( let i = 0; i < jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				// On first <p> tag in the document, display the contactList.
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(error)
	{
		document.getElementById("contactSearchResult").innerHTML = error.message;
	}
	
}

// Called from the addContactButton on tether.html.
function addContact()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

