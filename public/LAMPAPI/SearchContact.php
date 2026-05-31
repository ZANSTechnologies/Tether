<?php
	require_once 'Functions.php';

	// Fetch POST request JSON from searchColor().
    $inputData = getRequestInfo();
	
	$searchResults = ""; //< Search Results Container (content viewable).
	$searchCount = 0; //< Search Counter (when zero...).

    // Connect to mySQL Database.
	$connection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if ($connection->connect_error) 
	{
		returnWithError( $connection->connect_error);
	} 
	else
	{
        // Prepare mySQL query.
		$statement = $connection->prepare("SELECT FirstName, LastName, Phone, Email 
                                   FROM Contacts 
                                   WHERE (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ?) 
                                   AND UserID=?");

		// Prepare the name parameter, concatenating the SQL '%' wildcard on 
		// both ends. Can be used for the FirstName, LastName, and Email.
		$contactName = "%" . $inputData["search"] . "%";

		// Bind $inputData and $inputData["userId"] as parameters (?) to the query.
		$statement->bind_param("sssi", $contactName, $contactName, $contactName, $inputData["UserID"]);
		
		// Execute the prepared query statement.
		$statement->execute();
		
		// Retrieve result set from the statement.
		$result = $statement->get_result();
		
		// Loop over rows of the result set's associative arrray (key-value).
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;

			// Create returning JSON string.
			$searchResults .= '{"FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '"}';
		}
		
		// Return results (no records or more) as JSON.
		if( $searchCount == 0 )
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
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $error . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	// Will return an array of Results of contact JSON objects.
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>