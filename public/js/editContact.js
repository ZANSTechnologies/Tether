document.addEventListener("DOMContentLoaded", function()
{
    readCookie();
    loadContactData();
    document.getElementById("editContactForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        editContact();
    }
);
}
);

function loadContactData()
{
    // Get contact ID from URL e.g. editContact.html?id=42
    let params = new URLSearchParams(window.location.search);
    let contactId = params.get("id");

    if (!contactId)
    {
        window.location.href = "dashboard.html";
        return;
    }

    let url = urlBase + "/GetContact." + extension + "?id=" + contactId;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            let jsonObject = JSON.parse(xhr.responseText);
            document.getElementById("editContactFirstName").value = jsonObject.FirstName;
            document.getElementById("editContactLastName").value = jsonObject.LastName;
            document.getElementById("editContactPhone").value = jsonObject.Phone;
            document.getElementById("editContactEmail").value = jsonObject.Email;
        }
    };
    xhr.send();
}

function editContact()
{
    let params = new URLSearchParams(window.location.search);
    let contactId = params.get("id");
    let contactFirstName = document.getElementById("editContactFirstName").value.trim();
    let contactLastName = document.getElementById("editContactLastName").value.trim();
    let contactPhone = document.getElementById("editContactPhone").value.trim();
    let contactEmail = document.getElementById("editContactEmail").value.trim();
    let contactEditResult = document.getElementById("contactEditResult");
    let editContactButton = document.getElementById("editContactButton");

    contactEditResult.className = "mt-3 text-center";
    contactEditResult.innerHTML = "";

    if (contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "")
    {
        contactEditResult.classList.add("text-danger");
        contactEditResult.innerHTML = "Please fill in all fields before saving.";
        return;
    }

    let temp = {
        ContactID: contactId,
        FirstName: contactFirstName,
        LastName: contactLastName,
        Phone: contactPhone,
        Email: contactEmail,
        UserID: userId
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