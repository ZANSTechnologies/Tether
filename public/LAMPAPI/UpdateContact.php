<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from updateContact().
	$inputData = getRequestInfo();

    $text = $inputData["text"];
    $contactID = $inputData["contactID"];
    $toUpdate = $inputData["toUpdate"];
    $userID = $inputData["userID"];

    // Whitelist of editable columns. $toUpdate is interpolated into the SQL
    // below, so it must NEVER reach the query without passing this check.
    $userColumns = ["FirstName", "LastName", "Phone", "Email"];
    if (!in_array($toUpdate, $userColumns))
    {
        returnWithError("Invalid Field " . $toUpdate);
        exit; // Without this, execution fell through and ran the query anyway.
    }

	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if( $connection->connect_error )
    {
        returnWithError( $connection->connect_error );
    }
	else
	{
		// AND UserID=? means a user can only ever update their OWN contacts —
		// previously any client could update any contact ID in the database.
		$statement = $connection->prepare("UPDATE Contacts
                                            SET $toUpdate = ?
                                            WHERE ID = ? AND UserID = ?");

		$statement->bind_param("sii", $text, $contactID, $userID);
		$statement->execute();

		if ($statement->affected_rows > 0)
		{
			returnWithInfo($toUpdate, $text, $contactID);
		}
		else
		{
			returnWithError("No matching contact found (or the value is unchanged).");
		}

		$statement->close();
        $connection->close();
    }

    ///////////////////////////////////////////////////////////////////////////
    // Helper Functions
	function returnWithError( $error )
	{
        sendResultInfoAsJson( json_encode(array(
			"contactID" => 0, "updatedField" => "", "newValue" => "", "error" => $error
		)) );
	}

    function returnWithInfo( $field, $newValue, $contactID )
    {
        sendResultInfoAsJson( json_encode(array(
			"contactID" => (int)$contactID, "updatedField" => $field, "newValue" => $newValue, "error" => ""
		)) );
    }
?>
