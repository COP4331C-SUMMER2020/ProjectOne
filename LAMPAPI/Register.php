<?php

	$inData = getRequestInfo();
	
	// Named after database fields
	$login = $inData["login"];
	$firstName = "";
	$lastName = "";
	$plainPassword = $inData["password"];
	$hashedPassword = "";

	//$conn = new mysqli("localhost", "username for database", "domain password", "database name");
	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	
	else 
	{
		$hashedPassword = password_hash( $plainPassword , PASSWORD_DEFAULT);
		// Check whether User is in User DB table before allowing them to register
		$sql = "SELECT login,password,firstName,lastName FROM Users where Login='" . $login . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{	
			returnWithError("User Name is Already Taken");
		}
		else
		{
			// TODO: $inData arguements may need to change
			$login = $inData["login"];
			$firstName = $inData["firstName"];
			$lastName = $inData["lastName"];

			// TODO: variables may need to change
			// Inserting newly registered user into Users DB table
			$sql = "INSERT into Users (firstName,lastName,login,password) VALUES ('" . $firstName . "','" . $lastName . "','" . $login . "','" . $hashedPassword . "')";

			// CHeck if insertion was unsuccessful
			if( $result = $conn->query($sql) != TRUE )
			{
				returnWithError( $conn->error );
			}

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
		$retValue = '{"login":"","firstName":"","lastName":"","password":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>