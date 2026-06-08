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

