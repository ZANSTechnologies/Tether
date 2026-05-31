<?php
	require_once 'Functions.php'; 

	// Fetch POST request JSON from...
	$inputData = getRequestInfo();
	
	$firstName = $inputData["userFirstName"];
	$lastName = $inputData["userLastName"];
	$login = $inputData["userLogin"];
	$password = $inputData["userPassword"];

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager"); 	
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
	}
	else
	{
		// Prepare the User insert SQL statement.
		$statement = $connection->prepare("INSERT INTO Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");

		$statement->bind_param("ssss", $firstName, $lastName, $login, $password);
		$statement->execute();
		$result = $statement->get_result();

		// Loop through result set array by row.
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
		}
		else
		{
			returnWithError("Could not register user" . $firstName . " " . $lastName);
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
