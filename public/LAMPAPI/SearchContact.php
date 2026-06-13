<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from searchContact().
    $inputData = getRequestInfo();

    // Connect to mySQL Database.
	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if ($connection->connect_error)
	{
		returnWithError( $connection->connect_error);
	}
	else
	{
        // Prepare mySQL query.
		$statement = $connection->prepare("SELECT FirstName, LastName, Phone, Email, ID
                                   FROM Contacts
                                   WHERE (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ?)
                                   AND UserID=?");

		// Concatenate the SQL '%' wildcard on both ends. An empty search
		// therefore matches EVERY contact (used by the dashboard's
		// load-everything-on-arrival behavior).
		$contactName = "%" . $inputData["search"] . "%";

		$statement->bind_param("sssi", $contactName, $contactName, $contactName, $inputData["UserID"]);
		$statement->execute();
		$result = $statement->get_result();

		// Collect rows into a PHP array; json_encode handles all escaping,
		// so contact names containing quotes can't break the response.
		$searchResults = array();
		while($row = $result->fetch_assoc())
		{
			$searchResults[] = array(
				"FirstName" => $row["FirstName"],
				"LastName" => $row["LastName"],
				"Phone" => $row["Phone"],
				"Email" => $row["Email"],
				"ID" => (int)$row["ID"]
			);
		}

		// Return results (no records or more) as JSON.
		if( count($searchResults) == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$statement->close(); // Close Query Statement.
		$connection->close(); // Close database connection.
	}

    ///////////////////////////////////////////////////////////////////////////
    // Helper Functions
	function returnWithError( $error )
	{
		sendResultInfoAsJson( json_encode(array("results" => array(), "error" => $error)) );
	}

	// Returns an array of contact objects under "results".
	function returnWithInfo( $searchResults )
	{
		sendResultInfoAsJson( json_encode(array("results" => $searchResults, "error" => "")) );
	}
?>
