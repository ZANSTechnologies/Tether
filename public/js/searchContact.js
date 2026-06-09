var searchResults = [];

function prepareUpdate(contactID, contactFirstName, contactLastName, contactPhone, contactEmail)
{
	const paramsData = {
		id: contactID,
		firstName: contactFirstName,
		lastName: contactLastName,
		phone: contactPhone,
		email: contactEmail
	};
	const searchParams = new URLSearchParams(paramsData);

	const url = new URL('https://tetherbyzans.com/html/editContact.html');
	url.search = searchParams.toString();
	
	window.location.href = url.toString();
}

// Called from the searchContactButton on dashboard.html. Populates the page with 
// the search results.
function searchContact()
{
	searchResults.length = 0;

	let searchText = document.getElementById("searchInput").value;

	document.getElementById("contactSearchResult").innerHTML = "";
	document.getElementById("contactList").innerHTML = "";

	let temp = {search:searchText, UserID:userId};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error !== "")
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					return;
				}

				document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved!";

				searchResults = jsonObject.results;

				renderContactList(jsonObject.results);
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

// FIX: Extracted list rendering into its own function so deleteContact() can
// call it to refresh the list after a successful delete, without a full re-search.
function renderContactList(contacts)
{
	const contactListEl = document.getElementById("contactList");
	contactListEl.innerHTML = "";

	contacts.forEach(function(contact)
	{
		// FIX: Build each contact as a .contact-item glass card per frutiger.css,
		// instead of raw unstyled string concatenation.
		const item = document.createElement("div");
		item.className = "contact-item";

		const info = document.createElement("span");
		info.innerHTML = "<strong>" + contact.FirstName + " " + contact.LastName + "</strong>"
			+ " &nbsp;|&nbsp; " + contact.Phone
			+ " &nbsp;|&nbsp; " + contact.Email;

		const actions = document.createElement("div");
		actions.className = "d-flex gap-2";
		actions.style.cssText = "display:flex;justify-content:space-around";

		const editBtn = document.createElement("button");
		editBtn.className = "btn btn-primary btn-sm";
		editBtn.textContent = "Edit";
		editBtn.addEventListener("click", function()
		{
			prepareUpdate(contact.ID, contact.FirstName, contact.LastName, contact.Phone, contact.Email);
		});

		const deleteBtn = document.createElement("button");
		deleteBtn.className = "btn btn-sm";
		deleteBtn.style.cssText = "background:rgba(220,53,69,0.8);color:white;border-radius:12px;border:1px solid rgba(255,255,255,0.4);";
		deleteBtn.textContent = "Delete";
		deleteBtn.addEventListener("click", function()
		{
			deleteContact(contact.ID, userId);
		});

		actions.appendChild(editBtn);
		actions.appendChild(deleteBtn);
		item.appendChild(info);
		item.appendChild(actions);
		contactListEl.appendChild(item);
	});
}