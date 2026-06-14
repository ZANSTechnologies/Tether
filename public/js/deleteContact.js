// Deletes a contact entry from the database. Called from the confirmation
// modal on dashboard.html (see dashboard.js) — never directly from the
// Delete button, so there is always an "Are you sure?" step.
// contactID (int): the ID of the contact to delete.
// userID (int): the ID of the user that owns the contact.
function deleteContact(contactID, userID)
{
    let temp = {contactID:contactID, userID:userID};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/DeleteContact.' + extension;

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

                if (jsonObject.ID < 1)
                {
                    document.getElementById("deleteResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("deleteResult").innerHTML = "Contact deleted successfully.";

                // Remove the deleted contact from the cached searchResults
                // array and re-render so the change shows immediately,
                // without needing to search again.
                searchResults = searchResults.filter(function(c)
                {
                    return c.ID != contactID;
                });
                renderContactList(searchResults);
                renderContactGraph(searchResults);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("deleteResult").innerHTML = err.message;
    }
}
