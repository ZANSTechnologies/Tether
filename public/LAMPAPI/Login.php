<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from doLogin().
	$inputData = getRequestInfo();

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
	}
	else
	{
		// Look the user up by login only — the password is verified against
		// the stored bcrypt hash with password_verify(), never compared in SQL.
		$statement = $connection->prepare("SELECT ID,FirstName,LastName,Password FROM Users WHERE Login=?");

		$statement->bind_param("s", $inputData["userLogin"]);
		$statement->execute();
		$result = $statement->get_result();

		$row = $result->fetch_assoc();

		if( $row && password_verify($inputData["userPassword"], $row['Password']) )
		{
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
		}
		else
		{
			// Same message whether the login or the password was wrong, so an
			// attacker can't probe for which usernames exist.
			returnWithError("No Records Found");
		}

		$statement->close();
		$connection->close();
	}

	///////////////////////////////////////////////////////////////////////////
    // Helper Functions
	// json_encode handles all escaping, so names with quotes or backslashes
	// can never produce malformed JSON.
	function returnWithError( $error )
	{
		sendResultInfoAsJson( json_encode(array(
			"ID" => 0, "FirstName" => "", "LastName" => "", "error" => $error
		)) );
	}

	function returnWithInfo( $FirstName, $LastName, $ID )
	{
		sendResultInfoAsJson( json_encode(array(
			"ID" => (int)$ID, "FirstName" => $FirstName, "LastName" => $LastName, "error" => ""
		)) );
	}
?>
