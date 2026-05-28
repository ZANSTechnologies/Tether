<?php
    // SearchContact.php
    // Modified from SearchColor.php in-class  example.

	// TODO: query over lastnames as well... possibly more?
	
	// Fetch input from frontend.
    $inData = getRequestInfo();
	
	$searchResults = ""; //< Search Results Container (content viewable).
	$searchCount = 0; //< Search Counter (when zero...).

    // Connect to mySQL Database.
	$mysqlConnection = new mysqli("localhost", "ContactUser", "ContactPassword123!", "ContactManager");
	if ($mysqlConnection->connect_error) 
	{
		returnWithError( $mysqlConnection->connect_error);
	} 
	else
	{
        // Prepare mySQL query.
		$statement = $mysqlConnection->prepare("select FirstName from Users where FirstName like ? and ID=?");

		// Prepare the name parameter, concatenating the SQL '%' wildcard on 
		// both ends.
		$contactName = "%" . $inData["search"] . "%";

		// Bind $inData and $inData["userId"] as parameters (?) to the query.
		$statement->bind_param("ss", $contactName, $inData["userId"]);
		
		// Execute the prepared query statement.
		$statement->execute();
		
		// Retrieve result set from the statement.
		$result = $statement->get_result();
		
		// Loop over each row of the result set as an associative array (key-value). 
		// Concatenate searchResults with ","
		// Happens for more than 1 element of the array:
		// e.g., "John","Sarah","Mike"
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["FirstName"] . '"';
		}
		
		// Return results (no records or more) as JSON
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$statement->close(); //< Close Query Statement.
		$mysqlConnection->close(); //< Close database connection.
	}

    ////////////////////////////////////////////////////////////////////////////
    // Helper Functions
	
    // Fetch input in JSON. 
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// Server to Client Response telling browser from the HTTP header that
	// the message is JSON.
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>