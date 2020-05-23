<?php

	$inData = getRequestInfo();

	// Named after database fields for a new contact
	//This will be search page info
	$email = $inData["email"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];
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
			//This line pulls all info from contact entry
			$row = $result->fetch_assoc();
			$userID = $row["userID"];
		}

		//This would now be on 'edit' page
		$inData = getRequestInfo();
		$email = $inData["email"];
		$firstName = $inData["firstName"];
		$lastName = $inData["lastName"];
		$phoneNumber = $inData["phoneNumber"];

		// TODO: variables may need to change
		// Inserting newly registered user into Users DB table
		$sql = "UPDATE Contacts SET firstname = '" . $firstName . "', lastName = '" . $lastName . "', phoneNumber = '" . $phoneNumber . "', email = '" . $email . "' WHERE userID = '". $userID ."'";

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
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":' . $email . ',"phoneNumber":' . $phoneNumber . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($firstName, $lastName, $email, $phoneNumber)
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":' . $email . ',"phoneNumber":' . $phoneNumber . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>