// Registers a new user into Tether. Called from register.html.
// Includes the live password criteria checklist: the Register button stays
// disabled until every criterion is met. Register.php re-validates the same
// rules server-side, so this is convenience, not the security boundary.

document.addEventListener("DOMContentLoaded", function()
{
    // Re-run the checklist on every keystroke in either password field.
    document.getElementById("password").addEventListener("input", checkPasswordCriteria);
    document.getElementById("confirmPassword").addEventListener("input", checkPasswordCriteria);

    // Submit via button click OR Enter key.
    document.getElementById("registerForm").addEventListener("submit", function(event)
    {
        event.preventDefault();
        registerUser();
    });
});

// Returns true when every criterion is met; also paints the checklist.
function checkPasswordCriteria()
{
    let password = document.getElementById("password").value;
    let confirm  = document.getElementById("confirmPassword").value;

    let checks = {
        critLength:  password.length >= 8,
        critUpper:   /[A-Z]/.test(password),
        critLower:   /[a-z]/.test(password),
        critNumber:  /[0-9]/.test(password),
        critSpecial: /[^A-Za-z0-9]/.test(password),
        critMatch:   password !== "" && password === confirm
    };

    let allMet = true;
    for (let id in checks)
    {
        document.getElementById(id).classList.toggle("met", checks[id]);
        if (!checks[id]) allMet = false;
    }

    document.getElementById("registerBtn").disabled = !allMet;
    return allMet;
}

function registerUser()
{
    let registerResult = document.getElementById("registerResult");
    registerResult.className = "d-block mb-3 text-center";
    registerResult.innerHTML = "";

    // Get registration input.
    let first    = document.getElementById("first").value.trim();
    let last     = document.getElementById("last").value.trim();
    let login    = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    if (first == "" || last == "" || login == "")
    {
        registerResult.classList.add("text-danger");
        registerResult.innerHTML = "Please fill in all fields.";
        return;
    }

    // Belt and suspenders: the button should be disabled if criteria fail,
    // but re-check anyway in case the DOM was tampered with.
    if (!checkPasswordCriteria())
    {
        registerResult.classList.add("text-danger");
        registerResult.innerHTML = "Password does not meet the requirements.";
        return;
    }

    // Create JSON string.
    let temp = {userFirstName:first, userLastName:last, userLogin:login, userPassword:password};
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

                // "ID":0 means the registration failed.
                if (jsonObject.ID < 1)
                {
                    registerResult.classList.add("text-danger");
                    registerResult.innerHTML = jsonObject.error;
                    return;
                }

                // Success! Log the new user straight in instead of bouncing
                // them back to the login page.
                userId    = jsonObject.ID;
                firstName = jsonObject.FirstName;
                lastName  = jsonObject.LastName;

                saveCookie();
                window.location.href = "dashboard.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        registerResult.classList.add("text-danger");
        registerResult.innerHTML = err.message;
    }
}
