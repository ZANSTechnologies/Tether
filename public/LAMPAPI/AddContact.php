<?php
	require_once 'Functions.php';

	$inputData = getRequestInfo();

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager"); 	
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
	}
	else
	{
		$statement = $connection->prepare(
			"INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
		$statement->bind_param(
			"ssssi",
			$inputData["FirstName"],
			$inputData["LastName"],
			$inputData["Phone"], 
			$inputData["Email"], 
			$inputData["UserID"]);
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