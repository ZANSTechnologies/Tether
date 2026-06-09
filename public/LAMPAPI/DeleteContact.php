<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from doLogin().
	$inputData = getRequestInfo();
	
    // The only information the frontend will send to the database is the contact's
    // ID and its associated user. This is so if there are multiple contacts 
    // with the same information, we can isolate one from many. This assumes that
    // the contact ID is attached to some "button" input specific to that contact. 
	$contactID = $inputData["contactID"];
    $userID = $inputData["userID"];

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager"); 	
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
	}
	else
	{
		$statement = $connection->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");

		$statement->bind_param("ss", $contactID, $userID);
		$statement->execute();
		// FIX: Removed $statement->get_result() — DELETE does not return a result set.
		// Calling get_result() on a non-SELECT statement causes a fatal PHP error.

        // Delete Success!
        if( $statement->affected_rows > 0 )
        {
            returnWithInfo($contactID, $userID);
        }
        // Query ran, no one to delete...
        else if( $statement->affected_rows == 0 )
        {
            returnWithError("No contact found to delete.");
        }
        // Query Failure (-1).
        else
        {
            returnWithError("Delete failed: " . $statement->error);
        }

		$statement->close();
		$connection->close();
	}
	
	///////////////////////////////////////////////////////////////////////////
    // Helper Functions
	function returnWithError( $error )
	{
		$returnValue = '{"ID":0,"UserID":"0","error":"' . $error . '"}';
		sendResultInfoAsJson( $returnValue );
	}
	
	function returnWithInfo( $ID, $UserID )
	{
		$returnValue = '{"ID":' . $ID . ',"UserID":"' . $UserID . '","error":""}';
		sendResultInfoAsJson( $returnValue );
	}
?>