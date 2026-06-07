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
