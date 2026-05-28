<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from doLogin().
	$inputData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager"); 	
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
	}
	else
	{
		// Query Database for Credentials.
		$statement = $connection->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");

		// JSON from POST request by doLogin() .js function.
		$statement->bind_param("ss", $inputData["userLogin"], $inputData["userPassword"]);
		$statement->execute();
		$result = $statement->get_result();

		// Loop through result set array by row.
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$statement->close();
		$connection->close();
	}
	
	///////////////////////////////////////////////////////////////////////////
    // Helper Functions
	function returnWithError( $error )
	{
		$returnValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $error . '"}';
		sendResultInfoAsJson( $returnValue );
	}
	
	function returnWithInfo( $FirstName, $LastName, $ID )
	{
		$returnValue = '{"ID":' . $ID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","error":""}';
		sendResultInfoAsJson( $returnValue );
	}
	
?>
