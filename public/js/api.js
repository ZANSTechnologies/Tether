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

// NOT API -> NO SERVER INTERACTION
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
function searchContact()
{
	let searchText = document.getElementById("searchText").value;

	// empty contactSearchResult span on tether.html
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	// Create JSON string of the search and the current user.
	let temp = {search:searchText,UserId:userId};
	let jsonPayload = JSON.stringify( temp );

	let url = urlBase + '/SearchContact.' + extension;
	
	// Asynchronous POST request using the SearchContact.php script.
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
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
                    let contact = jsonObject.result[i];
					contactList += contact.FirstName + " " + contact.LastName + " | " + contact.Phone + " | " + contact.Email;
                   
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

// Called from the addContactButton on tether.html. Adds a contact to the 
// Contacts table with the necessary field information. No response back from 
// the server, unless there's an error.
function addContact()
{
	// Get strings from the addContact input fields.
	let contactFirstName = document.getElementById("addContactFirstName").value.trim();
	let contactLastName = document.getElementById("addContactLastName").value.trim();
	let contactPhone = document.getElementById("addContactPhone").value.trim();
	let contactEmail = document.getElementById("addContactEmail").value.trim();
	document.getElementById("contactAddResult").innerHTML = "";

	// Validate that user entered text in each field.
    if( contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "" )
    {
        document.getElementById("contactAddResult").style.color = "red";
        document.getElementById("contactAddResult").innerHTML = "Please fill in all fields before adding a contact.";
        return;
    }

	// Create JSON string.
	let temp = {FirstName:contactFirstName,LastName:contactLastNames,Phone:contactPhone,Email:contactEmail,UserID:userId};
	let jsonPayload = JSON.stringify( temp );

	let url = urlBase + '/AddContact.' + extension;
	
	// Make request to server. Should be 1 way.
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			// On successful contact addition...
			if (this.readyState == 4 && this.status == 200) 
			{
				// JSON from returnWithError from AddContact.php.
				let jsonObject = JSON.parse( xhr.responseText );

				let error = jsonObject.error;
				
				if( error === "" )
				{		
					document.getElementById("contactAddResult").innerHTML = contactFirstName + " " + contactLastName + " has been added to contacts!";
				}
				else
				{
					document.getElementById("contactAddResult").innerHTML = "Add Contact Error: " + error;
					return;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(error)
	{
		document.getElementById("contactAddResult").innerHTML = error.message;
	}
	
}
