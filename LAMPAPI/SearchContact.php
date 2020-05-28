<?php

	$inData = getRequestInfo();

	// Named after database fields for a new contact
	$email = "";
	$fullName = $inData["fullName"];
	$currentID = $inData["ID"];
	$phoneNumber = "";
	$myfile = fopen("test3.txt", "w") or die("Unable to open file!");
	fwrite($myfile, $currentID);
	fclose($myfile);
	//$conn = new mysqli("localhost", "elevenbr_eleventy", "domain password", "database name");
	// connect with server
	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}

	else
	{
		// Discuss
		
		//$currentID = 8;
		// TODO: $inData arguments may need to change, how to do partial match?
		$sql = "SELECT firstName,lastName,email,phoneNumber FROM Contacts where fullName like '%" . $fullName . "%' and userID='" . $currentID . "'";
		$result = $conn->query($sql);
		// If found, return the contact	
		if ($result->num_rows > 0)
		{	
			$row = $result->fetch_assoc();
			$firstName = $row["firstName"];
			$lastName = $row["lastName"];
			$email = $row["email"];
			$phoneNumber = $row["phoneNumber"];
			returnWithInfo($firstName, $lastName, $email, $phoneNumber);
		}
		//otherwise return an error that none were found
		else
		{
			returnWithError("No contacts found.");

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
		$retValue = '{"firstName": "","lastName":"","email":"","phoneNumber":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($firstName, $lastName, $email, $phoneNumber)
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","phoneNumber":"' . $phoneNumber . '"}';
		sendResultInfoAsJson( $retValue );
	}
