<?php

	$inData = getRequestInfo();

	// Named after database fields for a new contact
	//This will be search page info
	$email = $inData["email"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];
	$contactID = $inData["contactID"];
	$currentID = $inData["ID"];
	$fullName = $firstName;
	$fullName .= " ";
	$fullName .= $lastName;

	//$conn = new mysqli("localhost", "elevenbr_eleventy", "domain password", "database name");
	// connect with server
	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}

	else 
	{	
		
		// TODO: variables may need to change
		// Inserting newly registered user into Users DB table
		$sql = "UPDATE Contacts SET firstname = '" . $firstName . "', lastName = '" . $lastName . "', phoneNumber = '" . $phoneNumber . "', email = '" . $email . "', fullName = '" . $fullName . "' where contactID = '" . $contactID . "'";

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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($firstName, $lastName, $email, $phoneNumber)
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":' . $email . ',"phoneNumber":' . $phoneNumber . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>