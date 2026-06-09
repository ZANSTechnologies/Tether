// FIX: The original cookie stored all values as one comma-delimited string:
//   "firstName=John,lastName=Smith,userId=5,expires=Thu, 01 Jan..."
// Splitting on "," broke on the comma inside the GMT date string, and was
// fragile across browsers. Each value is now stored as its own named cookie
// using the standard "key=value; expires=...; path=/" format, which is how
// document.cookie is designed to work.

// Save user session.
function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    let expires = "; expires=" + date.toUTCString() + "; path=/";

    document.cookie = "firstName=" + encodeURIComponent(firstName) + expires;
    document.cookie = "lastName="  + encodeURIComponent(lastName)  + expires;
    document.cookie = "userId="    + userId                         + expires;
}

// Reads the session cookies and populates globals. Redirects to login if no
// valid session is found.
function readCookie()
{
    userId = -1;
    firstName = "";
    lastName = "";

    // document.cookie returns all cookies as "key=value; key=value; ..."
    // Each pair is separated by "; " — no commas, no date ambiguity.
    let cookies = document.cookie.split("; ");

    for (let i = 0; i < cookies.length; i++)
    {
        // Split on first "=" only, in case a value contains "=".
        let eqIndex = cookies[i].indexOf("=");
        if (eqIndex === -1) continue;

        let key   = cookies[i].substring(0, eqIndex).trim();
        let value = cookies[i].substring(eqIndex + 1).trim();

        if (key === "firstName")
        {
            firstName = decodeURIComponent(value);
        }
        else if (key === "lastName")
        {
            lastName = decodeURIComponent(value);
        }
        else if (key === "userId")
        {
            userId = parseInt(value);
        }
    }

    if (userId < 0)
    {
        window.location.href = "../index.html";
    }
    else
    {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName + "!";
    }
}