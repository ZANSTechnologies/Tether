<?php
	// Fetch input in JSON.
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// Server to Client Response telling browser from the HTTP header that
	// the message is JSON. Parsed in JS by lines like:
    // let jsonObject = JSON.parse( xhr.responseText );
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
?>
