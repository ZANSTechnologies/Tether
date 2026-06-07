// Used to delete a contact entry from the database.
// contactID (int): the ID of the contact to delete.
// userID (int): the ID of the user that owns the contact. 
function deleteContact(contactID, userID)
{
    // Create JSON string.
    let temp = {contactID:contactID, userID:userID};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/DeleteContact.' + extension;

    // Prepare an asynchronous POST request using the DeleteContact.php script.
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                // JSON from returnWithInfo() or returnWithError() in DeleteContact.php.
                let jsonObject = JSON.parse(xhr.responseText);

                // "ID":0
                if (jsonObject.ID < 1)
                {
                    document.getElementById("deleteResult").innerHTML = jsonObject.error;
                    return;
                }

                // Delete was successful, should update list
                document.getElementById("deleteResult").innerHTML = "Contact deleted successfully.";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("deleteResult").innerHTML = err.message;
    }
}