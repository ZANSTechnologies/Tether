<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from deleteContact().
	$inputData = getRequestInfo();

    // Only the contact's ID and its owning user are needed. The UserID in
    // the WHERE clause means a user can only ever delete their OWN contacts.
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

		$statement->bind_param("ii", $contactID, $userID);
		$statement->execute();
		// No $statement->get_result() — DELETE does not return a result set.

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
		sendResultInfoAsJson( json_encode(array(
			"ID" => 0, "UserID" => 0, "error" => $error
		)) );
	}

	function returnWithInfo( $ID, $UserID )
	{
		sendResultInfoAsJson( json_encode(array(
			"ID" => (int)$ID, "UserID" => (int)$UserID, "error" => ""
		)) );
	}
?>
