<?php

	$inData = getRequestInfo();

	// Named after database fields for a new contact
	$email = $inData["email"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phoneNumber = $inData["phoneNumber"];

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

		//DISCUSS
		//attempt to get current user's ID
		//Current best guess
		$currentID = $_SESSION['ID'];
		$sql = "SELECT firstName,lastName,email,phoneNumber FROM Contacts where firstName='" . $firstName . "' and lastName='" . $lastName . "' and email= '" . $email . "' and phoneNumber= '" . $phoneNumber . "' and userID= '" . $currentID . "'";
		$result = $conn->query($sql);
		// Such a contact already exists
		if ($result->num_rows > 0)
		{	
			returnWithError("Contact with this information already exists.");
		}
		//otherwise add into user's database
		else
		{
			// TODO: $inData arguements may need to change
			$email = $inData["email"];
			$firstName = $inData["firstName"];
			$lastName = $inData["lastName"];
			$phoneNumber = $inData["phoneNumber"];
			
			//attempt to get current user's ID
			//Current best guess
			//$currentID = $_SESSION['ID'];
			
			// TODO: does new contact's ID match user's ID?
			// Inserting newly registered user into Users DB table
			$sql = "INSERT into Contacts (firstName,lastName,phoneNumber,email,userID) VALUES ('" . $firstName . "','" . $lastName . "','" . $phoneNumber . "','" . $email . "','" . $currentID . "')";

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