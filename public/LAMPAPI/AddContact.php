<?php
	require_once 'Functions.php';

	$inputData = getRequestInfo();

	$contactFirstName = $inputData["FirstName"];
	$contactLastName = $inputData["LastName"];
	$contactPhone = $inputData["Phone"];
	$contactEmail = $inputData["Email"];
	$userId = $inputData["UserID"];

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager"); 	
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
	}
	else
	{
		// Add a conteact with the information the user supplied from frontend.
		$statement = $connection->prepare(
			"INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
		$statement->bind_param(
			"ssssi",
			$contactFirstName,
			$contactLastName,
			$contactPhone, 
			$contactEmail, 
			$userId);
		if ($statement->execute()) // no $statement->get_result() for INSERT's
		{
			returnWithInfo($contactFirstName, $contactLastName, $contactPhone, $contactEmail, $userId);
		}
		else
		{
			returnWithError("Could not Add Contact");
		}

		// Close connection.
		$statement->close();
		$connection->close();
		
	}

	///////////////////////////////////////////////////////////////////////////
    // Helper Functions
	function returnWithError( $error )
	{
		$returnValue = '{"ID":0,"FirstName":"","LastName":"","Phone":"","Email":"","UserID":"","error":"' . $error . '"}';
		sendResultInfoAsJson( $returnValue );
	}
	
	function returnWithInfo( $FirstName, $LastName, $Phone, $Email, $UserID )
	{
		$returnValue = '{"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Phone":"' . $Phone . '","Email":"' . $Email . '","UserID":"' . $UserID . '","error":""}';
		sendResultInfoAsJson( $returnValue );
	}
?>
