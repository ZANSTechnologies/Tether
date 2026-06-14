<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from registerUser().
	$inputData = getRequestInfo();

	$firstName = trim($inputData["userFirstName"] ?? "");
	$lastName = trim($inputData["userLastName"] ?? "");
	$login = trim($inputData["userLogin"] ?? "");
	$password = $inputData["userPassword"] ?? "";

	if ($firstName === "" || $lastName === "" || $login === "")
	{
		returnWithError("Please fill in all fields.");
		exit;
	}

	// Re-validate the password criteria server-side. The checklist in
	// registerUser.js is convenience for the user; THIS is the enforcement.
	if ( strlen($password) < 8
		|| !preg_match('/[A-Z]/', $password)
		|| !preg_match('/[a-z]/', $password)
		|| !preg_match('/[0-9]/', $password)
		|| !preg_match('/[^A-Za-z0-9]/', $password) )
	{
		returnWithError("Password must be 8+ characters with an uppercase letter, lowercase letter, number, and special character.");
		exit;
	}

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
		exit;
	}

	// Reject duplicate usernames with a clear message instead of a raw
	// database error.
	$check = $connection->prepare("SELECT ID FROM Users WHERE Login=?");
	$check->bind_param("s", $login);
	$check->execute();
	$checkResult = $check->get_result();
	if ($checkResult->fetch_assoc())
	{
		$check->close();
		$connection->close();
		returnWithError("That username is already taken.");
		exit;
	}
	$check->close();

	// Hash the password with bcrypt before it ever touches the database.
	// password_verify() in Login.php checks against this hash.
	$passwordHash = password_hash($password, PASSWORD_DEFAULT);

	$statement = $connection->prepare("INSERT INTO Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
	$statement->bind_param("ssss", $firstName, $lastName, $login, $passwordHash);
	$statement->execute();

	if ($statement->affected_rows > 0)
	{
		// insert_id returns the ID of the row just added.
		$newUserID = $statement->insert_id;
		returnWithInfo( $firstName, $lastName, $newUserID );
	}
	else
	{
		returnWithError("Could not register user " . $firstName . " " . $lastName);
	}

	$statement->close();
	$connection->close();

	///////////////////////////////////////////////////////////////////////////
    // Helper Functions
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
