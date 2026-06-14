// Used for the (index.html) landing page login.
// Wired to the loginForm submit event so both the button and the
// Enter key trigger a login attempt.
document.addEventListener("DOMContentLoaded", function()
{
	document.getElementById("loginForm").addEventListener("submit", function(event)
	{
		event.preventDefault();
		doLogin();
	});
});

function doLogin()
{
	// re-assign default values to the globals
	userId = 0;
	firstName = "";
	lastName = "";

	// Get userLogin and userPassword input.
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	// Create JSON string. The password travels as plaintext over HTTPS and is
	// verified server-side against a bcrypt hash (see Login.php).
	let temp = {userLogin:login, userPassword:password};
	let jsonPayload = JSON.stringify(temp);

	let url = urlBase + '/Login.' + extension;

	// Prepare an asynchronous request to Server using the Login.php script.
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			// readyState 4: DONE. status 200: OK.
			if (this.readyState == 4 && this.status == 200)
			{
				// JSON from returnWithInfo() / returnWithError() in Login.php.
				let jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.ID;

				// returnWithError() from Login.php: "ID":0
				if (userId < 1)
				{
					document.getElementById("loginResult").classList.add("text-danger");
					document.getElementById("loginResult").innerHTML = "Username or Password is incorrect! Please try again.";
					return;
				}

				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();

				// update url / enter the tether webapp
				window.location.href = "html/dashboard.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").classList.add("text-danger");
		document.getElementById("loginResult").innerHTML = err.message;
	}
}
