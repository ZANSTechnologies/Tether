var searchResults = [];

function prepareUpdate(contactID, contactFirstName, contactLastName, contactPhone, contactEmail)
{
	// setup search parameters
	const paramsData = {
		id: contactID,
		firstName: contactFirstName,
		lastName: contactLastName,
		phone: contactPhone,
		email: contactEmail
	};
	const searchParams = new URLSearchParams(paramsData);

	// Append the url with the search parameters
	const url = new URL('https://tetherbyzans.com/html/editContact.html')	
	url.search = searchParams.toString();
	
	// Perform redirct to editContact.html with injected searchParams
	window.location.href = url.toString();
}

// Called from the searchContactButton on tether.html. Populates the page with 
// the search results.
function searchContact()
{
	// Begin with an empty array.
	searchResults.length = 0;

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
				
				// Populate stored array
				searchResults = jsonObject.results;

				for (let i = 0; i < jsonObject.results.length; i++)
				{
					let contact = jsonObject.results[i];

					contactList += contact.FirstName + " " + contact.LastName + 
								" | " + contact.Phone + 
								" | " + contact.Email;

					// Update button
					contactList += ` <button class="updateButton"
							data-id="${contact.ID}"
							data-first="${contact.FirstName}"
							data-last="${contact.LastName}"
							data-phone="${contact.Phone}"
							data-email="${contact.Email}">Edit</button>`;

					// Delete button
					contactList += ` <button onclick="deleteContact(${contact.ID}, ${userId})">Delete</button>`;

					if (i < jsonObject.results.length - 1)
					{
						contactList += "<br />\r\n";
					}
				}

				document.getElementById("contactList").innerHTML = contactList;

				document.querySelectorAll(".updateButton").forEach(btn => {
					btn.addEventListener("click", () => {
						prepareUpdate(
							btn.dataset.id,
							btn.dataset.first,
							btn.dataset.last,
							btn.dataset.phone,
							btn.dataset.email
						);
					});
				});
					
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
