// NOT API -> NO SERVER INTERACTION
// Called from the logoutButton on dashboard.html. Resets globals, expires
// ALL session cookies (firstName, lastName, userId — each with path=/ so the
// expiry actually matches the cookie saveCookie() created), and redirects
// the user to index.html.
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let expire = "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	document.cookie = "firstName" + expire;
	document.cookie = "lastName"  + expire;
	document.cookie = "userId"    + expire;

	window.location.href = "../index.html";
}
