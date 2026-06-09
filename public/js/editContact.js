// Setup editContact globals
// Read contact data from URL query parameters
var params = new URLSearchParams(window.location.search);
var contactId = params.get("id");
var contactFirstName = params.get("firstName");
var contactLastName = params.get("lastName");
var contactPhone = params.get("phone");
var contactEmail = params.get("email");

document.addEventListener("DOMContentLoaded", function()
{
    readCookie();

    loadContactData();
    document.getElementById("editContactForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        editContact();
    });
});

function loadContactData()
{
    // If no contact ID in URL, kick back to dashboard
    if (!contactId)
    {
        window.location.href = "dashboard.html";
        return;
    }

    // Pre-populate the form fields
    document.getElementById("editContactFirstName").value = contactFirstName || "";
    document.getElementById("editContactLastName").value = contactLastName || "";
    document.getElementById("editContactPhone").value = contactPhone || "";
    document.getElementById("editContactEmail").value = contactEmail || "";
}

function editContact()
{
    contactEditResult.className = "mt-3 text-center";
    contactEditResult.innerHTML = "";

    if (contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "")
    {
        contactEditResult.classList.add("text-danger");
        contactEditResult.innerHTML = "Please fill in all fields before saving.";
        return;
    }

    let temp = {
        text: contactId,
        contactID: contactFirstName,
        toUpdate: contactLastName
    };

    let jsonPayload = JSON.stringify(temp);
    let url = urlBase + "/UpdateContact." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    editContactButton.disabled = true;
    editContactButton.innerHTML = "Saving...";

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4)
            {
                editContactButton.disabled = false;
                editContactButton.innerHTML = "Save Changes";

                if (this.status != 200)
                {
                    contactEditResult.classList.add("text-danger");
                    contactEditResult.innerHTML = "Edit Contact Error: Could not reach the server.";
                    return;
                }

                let jsonObject;
                try
                {
                    jsonObject = JSON.parse(xhr.responseText);
                }
                catch(error)
                {
                    contactEditResult.classList.add("text-danger");
                    contactEditResult.innerHTML = "Edit Contact Error: The server returned an invalid response.";
                    return;
                }

                if (jsonObject.error == "")
                {
                    contactEditResult.classList.add("text-success");
                    contactEditResult.innerHTML = contactFirstName + " " + contactLastName + " has been updated!";
                    // Go back to dashboard after successful edit
                    setTimeout(function()
                    {
                        window.location.href = "dashboard.html";
                    }, 1500);
                }
                else
                {
                    contactEditResult.classList.add("text-danger");
                    contactEditResult.innerHTML = "Edit Contact Error: " + jsonObject.error;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(error)
    {
        editContactButton.disabled = false;
        editContactButton.innerHTML = "Save Changes";
        contactEditResult.classList.add("text-danger");
        contactEditResult.innerHTML = error.message;
    }
}
