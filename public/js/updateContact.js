// Updates a single field of an existing contact in the database.
// contactID (int): the ID of the contact to update.
// toUpdate (string): the column name to update ("FirstName", "LastName", "Phone", or "Email").
// text (string): the new value to write into that column.
//
// Returns a Promise so editContact.js can wait for ALL field updates to
// finish (Promise.all) before declaring success and redirecting. Previously
// the success message and redirect fired before any request completed.
function updateContact(contactID, toUpdate, text)
{
    return new Promise(function(resolve, reject)
    {
        // double check in PHP as well.
        const validFields = ["FirstName", "LastName", "Phone", "Email"];
        if (!validFields.includes(toUpdate))
        {
            reject(new Error("Invalid field: " + toUpdate));
            return;
        }

        // userID is included so UpdateContact.php can verify ownership —
        // without it, any client could edit any contact in the database.
        let temp = {contactID:contactID, toUpdate:toUpdate, text:text, userID:userId};
        let jsonPayload = JSON.stringify(temp);

        let url = urlBase + '/UpdateContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function()
        {
            if (this.readyState != 4) return;

            if (this.status != 200)
            {
                reject(new Error("Could not reach the server."));
                return;
            }

            let jsonObject;
            try
            {
                jsonObject = JSON.parse(xhr.responseText);
            }
            catch(error)
            {
                reject(new Error("The server returned an invalid response."));
                return;
            }

            // "contactID":0 means the update failed.
            if (jsonObject.contactID < 1)
            {
                reject(new Error(jsonObject.error));
                return;
            }

            // Per-field progress message.
            document.getElementById("updateResult").innerHTML =
                jsonObject.updatedField + " updated successfully.";
            resolve(jsonObject);
        };

        xhr.send(jsonPayload);
    });
}
