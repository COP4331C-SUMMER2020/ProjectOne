<?php

	$inData = getRequestInfo();

	// Named after database fields for a new contact
	$email = "";
	$firstName = "";
	$lastName = "";
	$phoneNumber = "";

	//$conn = new mysqli("localhost", "elevenbr_eleventy", "domain password", "database name");
	// connect with server
	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}

	else 
	{
		// Check whether contact is in user's contact DB table before allowing them to create new contact
		// TODO: $inData arguments may need to change
		$sql = "SELECT firstName,lastName FROM Contacts where firstName='" . $inData["firstName"] . "' and lastName='" . $inData["lastName"] . "'";
		$result = $conn->query($sql);
		// Such a contact already exists
		if ($result->num_rows > 0)
		{	
			returnWithError("Contact with this name already exists.");
		}
		//otherwise add into user's database
		else
		{
			// TODO: $inData arguements may need to change
			$email = $inData["email"];
			$firstName = $inData["firstName"];
			$lastName = $inData["lastName"];
			$phoneNumber = $inData["phoneNumber"];

			// TODO: variables may need to change
			// Inserting newly registered user into Users DB table
			$sql = "INSERT into Contacts (firstName,lastName,phoneNumber,email) VALUES (" . $firstName . "," . $lastName . "," . $phoneNumber . "," . $email . ")";

			// Check if insertion was unsuccessful
			if( $result = $conn->query($sql) != TRUE )
			{
				returnWithError( $conn->error );
			}

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
		$retValue = '{"login":"","firstName":"","lastName":"","password":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>