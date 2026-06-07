// NOT API -> NO SERVER INTERACTION
// Called from the logoutButton on tether.html. Resets globals and cookie and 
// redirects user to index.html. 
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
