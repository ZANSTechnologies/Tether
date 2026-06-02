<?php
	require_once 'Functions.php'; 

	// Fetch POST request JSON from...
	$inputData = getRequestInfo();
    
    $text = $inputData["text"];
    $contactID = $inputData["contactID"];
    $toUpdate = $inputData["toUpdate"];
    $userColumns = ["FirstName", "LastName", "Phone", "Email"]; 
    if (!in_array($toUpdate, $userColumns)) 
    {
        returnWithError("Invalid Field " . $toUpdate);
    }

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager"); 	
	if( $connection->connect_error )
    {
        returnWithError( $connection->connect_error );
    }
	else
	{
		// Prepare the User insert SQL statement.
		$statement = $connection->prepare("UPDATE Contacts
                                            SET $toUpdate = ?
                                            WHERE ID = ?");

		$statement->bind_param("si", $text, $contactID);
		$statement->execute();
		# $result = $statement->get_result(); -> An UPDATE does not return a result
		if ($statement->affected_rows > 0)
		{
			returnWithInfo($toUpdate, $text, $contactID);
		}
        else if ($statement->affected_rows == 0) 
        {
            // In the case it is a non-existant contact
            returnWithError("Cannot update if contact does not exist.")
        }
		else
		{
			returnWithError("Could not update contact: " . $statement->error);
		}

		$statement->close();
        $connection->close();
    }

    ///////////////////////////////////////////////////////////////////////////
    // Helper Functions
	function returnWithError( $error )
	{
        $returnValue = '{"contactID":0,"updatedField":"","newValue":"","error":"' . $error . '"}';
		sendResultInfoAsJson( $returnValue );
	}
	
    function returnWithInfo( $field, $newValue, $contactID )
    {
        $returnValue = '{"contactID":' . $contactID . ',"updatedField":"' . $field . '","newValue":"' . $newValue . '","error":""}';
        sendResultInfoAsJson( $returnValue );
    }
?>
