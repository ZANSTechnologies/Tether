// Used to update a single field of an existing contact in the database.
// contactID (int): the ID of the contact to update.
// toUpdate (string): the column name to update ("FirstName", "LastName", "Phone", or "Email").
// text (string): the new value to write into that column.
function updateContact(contactID, toUpdate, text)
{
    // double check in PHP as well.
    const validFields = ["FirstName", "LastName", "Phone", "Email"];
    if (!validFields.includes(toUpdate))
    {
        document.getElementById("updateResult").innerHTML = "Invalid field: " + toUpdate;
        return;
    }

    // Create JSON string.
    let temp = {contactID:contactID, toUpdate:toUpdate, text:text};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/UpdateContact.' + extension;

    // Prepare an asynchronous POST request using the UpdateContact.php script.
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                // JSON from returnWithInfo() or returnWithError() in UpdateContact.php.
                let jsonObject = JSON.parse(xhr.responseText);

                //"contactID":0
                if (jsonObject.contactID < 1)
                {
                    document.getElementById("updateResult").innerHTML = jsonObject.error;
                    return;
                }

                // Update was successful, should update UI
                document.getElementById("updateResult").innerHTML = 
                    jsonObject.updatedField + " updated successfully to: " + jsonObject.newValue;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("updateResult").innerHTML = err.message;
    }
}