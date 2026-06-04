document.addEventListener("DOMContentLoaded", function()
{
    readCookie();

    document.getElementById("addContactForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        addContact();
    });
});

function addContact()
{
    let contactFirstName = document.getElementById("addContactFirstName").value.trim();
    let contactLastName = document.getElementById("addContactLastName").value.trim();
    let contactPhone = document.getElementById("addContactPhone").value.trim();
    let contactEmail = document.getElementById("addContactEmail").value.trim();
    let contactAddResult = document.getElementById("contactAddResult");
    let addContactButton = document.getElementById("addContactButton");

    contactAddResult.className = "mt-3 text-center";
    contactAddResult.innerHTML = "";

    if (contactFirstName == "" || contactLastName == "" || contactPhone == "" || contactEmail == "")
    {
        contactAddResult.classList.add("text-danger");
        contactAddResult.innerHTML = "Please fill in all fields before adding a contact.";
        return;
    }

    let temp = {
        FirstName: contactFirstName,
        LastName: contactLastName,
        Phone: contactPhone,
        Email: contactEmail,
        UserID: userId
    };
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + "/AddContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    addContactButton.disabled = true;
    addContactButton.innerHTML = "Adding...";

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4)
            {
                addContactButton.disabled = false;
                addContactButton.innerHTML = "Add Contact";

                if (this.status != 200)
                {
                    contactAddResult.classList.add("text-danger");
                    contactAddResult.innerHTML = "Add Contact Error: Could not reach the server.";
                    return;
                }

                let jsonObject;
                try
                {
                    jsonObject = JSON.parse(xhr.responseText);
                }
                catch(error)
                {
                    contactAddResult.classList.add("text-danger");
                    contactAddResult.innerHTML = "Add Contact Error: The server returned an invalid response.";
                    return;
                }

                if (jsonObject.error == "")
                {
                    contactAddResult.classList.add("text-success");
                    contactAddResult.innerHTML = contactFirstName + " " + contactLastName + " has been added to contacts!";
                    document.getElementById("addContactForm").reset();
                }
                else
                {
                    contactAddResult.classList.add("text-danger");
                    contactAddResult.innerHTML = "Add Contact Error: " + jsonObject.error;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(error)
    {
        addContactButton.disabled = false;
        addContactButton.innerHTML = "Add Contact";
        contactAddResult.classList.add("text-danger");
        contactAddResult.innerHTML = error.message;
    }
}
