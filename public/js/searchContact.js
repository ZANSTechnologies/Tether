// Called from the searchContactButton on tether.html. Populates the page with 
// the search results.
function searchContact()
{
	let searchText = document.getElementById("searchInput").value;

	// empty contactSearchResult span on tether.html
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	// Create JSON string of the search and the current user.
	let temp = {search:searchText,UserID:userId};
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

				// when an error is present and the array is not populated.
				if (jsonObject.error !== "")
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					return;
				}
				
				// Loop through results array. 
				// See returnWithInfo() in SearchContact.php.
				for( let i = 0; i < jsonObject.results.length; i++ )
				{
                    let contact = jsonObject.results[i];
					contactList += contact.FirstName + " " + contact.LastName + " | " + contact.Phone + " | " + contact.Email;
                   
                    if( i < jsonObject.results.length - 1 )
                    {
                        contactList += "<br />\r\n";
                    }
				}
				
				// On first <p> tag in the document, display the contactList.
				document.getElementById("contactList").innerHTML = contactList;
				
				// Create the Graph based on search results
				renderContactGraph(jsonObject.results);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(error)
	{
		document.getElementById("contactSearchResult").innerHTML = error.message;
	}
}
