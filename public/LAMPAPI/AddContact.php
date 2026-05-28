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
		$statement = $connection->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email) VALUES(?,?,?,?,?)");
		$statement->bind_param("ssssi", $contactFirstName, $contactLastName, $contactPhone, $contactEmail, $userId);
		$statement->execute();
		$statement->close();
		$connection->close();
		returnWithError("");
	}

	function returnWithError( $error )
	{
		$returnValue = '{"error":"' . $error . '"}';
		sendResultInfoAsJson( $returnValue );
	}
?>