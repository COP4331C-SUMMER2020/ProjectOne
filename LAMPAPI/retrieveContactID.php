<?php
//first edit --> searches based upon current fields, returns "contactID"
//2nd edit --> UPDATE Contacts SET firstname based upon the contactID sent earlier

	$inData = getRequestInfo();
	$email = $inData["email"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];
	$contactID = 0;
	$currentID = $inData["ID"];

	//$conn = new mysqli("localhost", "elevenbr_eleventy", "domain password", "database name");
	// connect with server
	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}

	else 
	{	
		//pull just contactID from database to send to front end, to use for the actual edit later
		$sql = "SELECT contactID FROM Contacts where firstName='" . $firstName . "' and lastName='" . $lastName . "' and email='" . $email . "' 
				and phoneNumber='" . $phoneNumber . "' and userID='" . $currentID . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{	
			//This line pulls all info from contact entry
			$row = $result->fetch_assoc();
			$contactID = $row["contactID"];
			returnWithInfo($contactID);
		}
		else
		{
			returnWithError( "Something went wrong :/" );
		}

	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($contactID)
	{
		$retValue = '{"contactID":"' . $contactID . '"}';
		sendResultInfoAsJson( $retValue );
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
?>