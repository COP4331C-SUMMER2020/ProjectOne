<?php

	$inData = getRequestInfo();

	// Named after database fields for a new contact
	$firstName = "";
	$lastName = "";
	$userID = 0;

	//$conn = new mysqli("localhost", "elevenbr_eleventy", "domain password", "database name");
	// connect with server
	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	//TODO if no contact found send error
	else 
	{	


		//Not searching correctly(????) put if hardcode the ID it will delete correctly
		$sql = "SELECT userID FROM Contacts where firstName='" . $inData["firstName"] . "' and lastName='" . $inData["lastName"] . "'";
		$result = $conn->query($sql);

		if ($result->num_rows > 0)
		{	
			$row = $result->fetch_assoc();
			$userID = $row["userID"];
		}






		$sql = "DELETE FROM Contacts WHERE userID = '" . $userID . "'";

		// Check if update was unsuccessful
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError("Delete unsuccessful.");
		}
		else
		{
			returnWithError("Delete was successful.");
		}
		$conn->close();
	}


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>