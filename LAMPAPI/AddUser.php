<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$username = $inData["Username"];
	$passwd = $inData["Passwd"];

	$conn = new mysqli("localhost", "SmallGroup21", "group21COP4331", "COP4331"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Username,Passwd) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $username, $passwd);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Registered Successfully!");
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
	
?>