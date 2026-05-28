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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// Used on the tether.html page for reading the user session 
function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
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
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
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

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
