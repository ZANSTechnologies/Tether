// This file handles editContact.html.
// It reads contact data from URL parameters, pre-populates the form,
// and calls updateContact() once per field on submit.

document.addEventListener("DOMContentLoaded", function()
{
    readCookie();

    loadContactData();

    // Wire up form submission to editContact().
    document.getElementById("editContactForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        editContact();
    });
});

// Reads contact data from URL query parameters and populates form fields.
// If no contact ID is found in URL, redirects back to dashboard.
function loadContactData()
{
    let params = new URLSearchParams(window.location.search);
    let contactId = params.get("id");

    if (!contactId)
    {
        window.location.href = "../html/dashboard.html";
        return;
    }

    // Read remaining fields from URL and populate form.
    let firstName = params.get("firstName");
    let lastName = params.get("lastName");
    let phone = params.get("phone");
    let email = params.get("email");

    document.getElementById("editContactFirstName").value = firstName || "";
    document.getElementById("editContactLastName").value = lastName || "";
    document.getElementById("editContactPhone").value = phone || "";
    document.getElementById("editContactEmail").value = email || "";
}

// Validates form fields and calls updateContact() once per field.
// Redirects to dashboard on success.
function editContact()
{
    let params = new URLSearchParams(window.location.search);
    let contactId = params.get("id");

   // Get current form values.
    let contactFirstName = document.getElementById("editContactFirstName").value.trim();
    let contactLastName = document.getElementById("editContactLastName").value.trim();
    let contactPhone = document.getElementById("editContactPhone").value.trim();
    let contactEmail = document.getElementById("editContactEmail").value.trim();
    let contactEditResult = document.getElementById("contactEditResult");
    let editContactButton = document.getElementById("editContactButton");

    // Reset result message.
    contactEditResult.className = "mt-3 text-center";
    contactEditResult.innerHTML = "";

    // Validate all fields are filled.
    if (contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "")
    {
        contactEditResult.classList.add("text-danger");
        contactEditResult.innerHTML = "Please fill in all fields before saving.";
        return;
    }

    editContactButton.disabled = true;
    editContactButton.innerHTML = "Saving...";

    // Call updateContact() once per field, each makes its own POST to UpdateContact.php.
    updateContact(contactId, "FirstName", contactFirstName);
    updateContact(contactId, "LastName", contactLastName);
    updateContact(contactId, "Phone", contactPhone);
    updateContact(contactId, "Email", contactEmail);

    // Show success and redirect to dashboard after 1.5 seconds.
    contactEditResult.classList.add("text-success");
    contactEditResult.innerHTML = contactFirstName + " " + contactLastName + " has been updated!";

    setTimeout(function()
    {
        window.location.href = "dashboard.html";
    }, 1500);
}
