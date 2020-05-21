<?php

	$inData = getRequestInfo();

	// Named after database fields for a new contact
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$userID = 0;

	//$conn = new mysqli("localhost", "elevenbr_eleventy", "domain password", "database name");
	// connect with server
	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}

	else 
	{	
		$sql = "SELECT firstName,lastName FROM Contacts where firstName='" . $firstName . "' and lastName='" . $lastName . "'";
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
			returnWithError( $conn->error );
		}


		$conn->close();
	}

	returnWithError("");

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
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '",error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>