var searchResults = [];

// Sends the user to the edit page with the contact's current values in the
// URL, so editContact.js can pre-populate the form without an extra API call.
// Relative URL so it works on any host (live server or local testing).
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

	window.location.href = "editContact.html?" + searchParams.toString();
}

// Called from the search form on dashboard.html (and on page load with an
// empty query, which returns ALL of the user's contacts). Populates the
// list and the bubble graph with the results.
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
					// An empty result set is a normal state, not an error —
					// render the empty list/graph and say so kindly.
					if (jsonObject.error === "No Records Found")
					{
						document.getElementById("contactSearchResult").innerHTML =
							searchText === "" ? "No contacts yet — add your first one!" : "No contacts matched your search.";
						renderContactList([]);
						renderContactGraph([]);
					}
					else
					{
						document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					}
					return;
				}

				searchResults = jsonObject.results;

				document.getElementById("contactSearchResult").innerHTML =
					searchResults.length + (searchResults.length === 1 ? " contact found." : " contacts found.");

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

// Renders the contact list. Separate from searchContact() so deleteContact()
// can refresh the list after a delete without a full re-search.
// Uses textContent for all contact data (never innerHTML) so a contact named
// <script>alert(1)</script> stays a weird name instead of becoming code.
function renderContactList(contacts)
{
	const contactListEl = document.getElementById("contactList");
	contactListEl.innerHTML = "";

	contacts.forEach(function(contact)
	{
		// Each contact is a .contact-item glass card per frutiger.css.
		const item = document.createElement("div");
		item.className = "contact-item";

		const info = document.createElement("span");

		const nameEl = document.createElement("strong");
		nameEl.textContent = contact.FirstName + " " + contact.LastName;
		info.appendChild(nameEl);
		info.appendChild(document.createTextNode("\u00A0 | \u00A0" + contact.Phone + "\u00A0 | \u00A0" + contact.Email));

		const actions = document.createElement("div");
		actions.className = "d-flex gap-2";

		const editBtn = document.createElement("button");
		editBtn.className = "btn btn-primary btn-sm";
		editBtn.textContent = "Edit";
		editBtn.setAttribute("aria-label", "Edit " + contact.FirstName + " " + contact.LastName);
		editBtn.addEventListener("click", function()
		{
			prepareUpdate(contact.ID, contact.FirstName, contact.LastName, contact.Phone, contact.Email);
		});

		const deleteBtn = document.createElement("button");
		deleteBtn.className = "btn btn-failure btn-sm";
		deleteBtn.textContent = "Delete";
		deleteBtn.setAttribute("aria-label", "Delete " + contact.FirstName + " " + contact.LastName);
		deleteBtn.addEventListener("click", function()
		{
			// Confirmation modal first — actual delete happens when the user
			// confirms (see dashboard.js).
			showDeleteModal(contact);
		});

		actions.appendChild(editBtn);
		actions.appendChild(deleteBtn);
		item.appendChild(info);
		item.appendChild(actions);
		contactListEl.appendChild(item);
	});
}
