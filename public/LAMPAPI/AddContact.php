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
		// Add a contact with the information the user supplied from frontend.
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
			// insert_id: the new contact's ID, so the frontend can reference
			// it immediately (used by the dashboard's new-bubble animation).
			returnWithInfo($statement->insert_id, $contactFirstName, $contactLastName, $contactPhone, $contactEmail, $userId);
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
		sendResultInfoAsJson( json_encode(array(
			"ID" => 0, "FirstName" => "", "LastName" => "", "Phone" => "", "Email" => "", "UserID" => 0, "error" => $error
		)) );
	}

	function returnWithInfo( $ID, $FirstName, $LastName, $Phone, $Email, $UserID )
	{
		sendResultInfoAsJson( json_encode(array(
			"ID" => (int)$ID, "FirstName" => $FirstName, "LastName" => $LastName,
			"Phone" => $Phone, "Email" => $Email, "UserID" => (int)$UserID, "error" => ""
		)) );
	}
?>
