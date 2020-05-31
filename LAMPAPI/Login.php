<?php

	$inData = getRequestInfo();

	$id = 0;
	$firstName = "";
	$lastName = "";
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "elevenbr_eleventy", "Group11FTW!", "elevenbr_projectOne");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//Does user exist in database
		$sql = "SELECT ID,firstName,lastName,password FROM Users where Login='" . $login . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstName = $row["firstName"];
			$lastName = $row["lastName"];
			$id = $row["ID"];
			$hashedPassword = $row["password"];
		}
		/*else
		{
			returnWithError( "No Records Found" );
		}*/
		//check their password versus it's hash
		if (password_verify($password, $hashedPassword))
			returnWithInfo($firstName, $lastName, $id );
		else
		{
			returnWithError( "Incorrect Username/Password Combination" );
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

	function returnWithInfo( $firstName, $lastName, $id )
	{

		$retValue = '{"id":"' . $id . '","firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
