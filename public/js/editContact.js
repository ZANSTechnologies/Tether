// This file handles editContact.html.
// It reads contact data from URL parameters, pre-populates the form,
// and calls updateContact() once per CHANGED field on submit, waiting for
// every update to complete before reporting success and redirecting.

var params = new URLSearchParams(window.location.search);
var contactId = params.get("id");

// Original values from the URL — used to detect which fields changed.
var formFirstName = params.get("firstName");
var formLastName = params.get("lastName");
var formPhone = params.get("phone");
var formEmail = params.get("email");

document.addEventListener("DOMContentLoaded", function()
{
    readCookie();

    if (!contactId)
    {
        window.location.href = "dashboard.html";
        return;
    }

    loadContactData();

    // Wire up form submission (button click or Enter key).
    document.getElementById("editContactForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        editContact();
    });
});

// Reads contact data from URL query parameters and populates form fields.
function loadContactData()
{
    document.getElementById("editContactFirstName").value = formFirstName || "";
    document.getElementById("editContactLastName").value = formLastName || "";
    document.getElementById("editContactPhone").value = formPhone || "";
    document.getElementById("editContactEmail").value = formEmail || "";
}

// Validates form fields, sends one update per changed field, and redirects
// to the dashboard only after every update has succeeded.
function editContact()
{
    // Get current form values.
    let contactFirstName = document.getElementById("editContactFirstName").value.trim();
    let contactLastName = document.getElementById("editContactLastName").value.trim();
    let contactPhone = document.getElementById("editContactPhone").value.trim();
    let contactEmail = document.getElementById("editContactEmail").value.trim();
    let contactEditResult = document.getElementById("contactEditResult");
    let editContactButton = document.getElementById("editContactButton");

    // Reset result messages.
    contactEditResult.className = "mt-3 text-center";
    contactEditResult.innerHTML = "";
    document.getElementById("updateResult").innerHTML = "";

    // Validate all fields are filled.
    if (contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "")
    {
        contactEditResult.classList.add("text-danger");
        contactEditResult.innerHTML = "Please fill in all fields before saving.";
        return;
    }

    // Queue one update per changed field.
    let updates = [];
    if (formFirstName != contactFirstName)
    {
        updates.push(updateContact(contactId, "FirstName", contactFirstName));
    }
    if (formLastName != contactLastName)
    {
        updates.push(updateContact(contactId, "LastName", contactLastName));
    }
    if (formPhone != contactPhone)
    {
        updates.push(updateContact(contactId, "Phone", contactPhone));
    }
    if (formEmail != contactEmail)
    {
        updates.push(updateContact(contactId, "Email", contactEmail));
    }

    if (updates.length == 0)
    {
        contactEditResult.innerHTML = "No changes to save.";
        return;
    }

    editContactButton.disabled = true;
    editContactButton.innerHTML = "Saving...";

    Promise.all(updates)
        .then(function()
        {
            contactEditResult.classList.add("text-success");
            contactEditResult.innerHTML = contactFirstName + " " + contactLastName + " has been updated!";

            setTimeout(function()
            {
                window.location.href = "dashboard.html";
            }, 1500);
        })
        .catch(function(error)
        {
            editContactButton.disabled = false;
            editContactButton.innerHTML = "Save Changes";
            contactEditResult.classList.add("text-danger");
            contactEditResult.innerHTML = "Update failed: " + error.message;
        });
}
