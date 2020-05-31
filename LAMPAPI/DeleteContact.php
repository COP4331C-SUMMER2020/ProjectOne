<?php

	$inData = getRequestInfo();
	$contactID = $inData["contactID"];

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

		$sql = "DELETE FROM Contacts WHERE contactID = '" . $contactID . "'";

		// Check if update was unsuccessful
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError("Delete unsuccessful.");
		}
		else
		{
			returnWithInfo("Delete was successful.");
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

	function returnWithInfo( $err )
	{
		$retValue = '{"success":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>