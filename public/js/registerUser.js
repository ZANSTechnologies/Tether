// Used to register a new user into Tether..
// Called from the register.html.
function registerUser()
{
    // Get registration input.
    let firstName = document.getElementById("userFirstName").value;
    let lastName  = document.getElementById("userLastName").value;
    let login     = document.getElementById("userLogin").value;
    let password  = document.getElementById("userPassword").value;

    // Create JSON string.
    let temp = {userFirstName:firstName, userLastName:lastName, userLogin:login, userPassword:password};
    let jsonPayload = JSON.stringify(temp);

    let url = urlBase + '/Register.' + extension;

    // Prepare an asynchronous POST request using the Register.php script.
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    { 
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                // JSON from returnWithInfo() or returnWithError() in Register.php.
                let jsonObject = JSON.parse(xhr.responseText);

                // "ID":0
                if (jsonObject.ID < 1)
                {
                    document.getElementById("registerResult").innerHTML = jsonObject.error;
                    return;
                }

                // Success! Update global like doLogin() behavior.
                userId    = jsonObject.ID;
                firstName = jsonObject.FirstName;
                lastName  = jsonObject.LastName;

                saveCookie();

                window.location.href = "tether.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("registerResult").innerHTML = err.message;
    }
}