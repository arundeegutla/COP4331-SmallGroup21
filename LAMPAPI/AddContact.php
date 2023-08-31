<?php
	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	    header('Access-Control-Allow-Origin: *');
	    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
	    header('Access-Control-Allow-Headers: token, Content-Type');
	    header('Access-Control-Max-Age: 1728000');
	    header('Content-Length: 0');
	       header('Content-Type: text/plain');
	    die();
	}
	
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: POST');

	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNum = $inData["PhoneNum"];
	$email = $inData["Email"];
	$userId = $inData["UserID"];

	$conn = new mysqli("localhost", "SmallGroup21", "group21COP4331", "COP4331"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,PhoneNum,Email,UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $firstName, $lastName, $phoneNum, $email, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Added Successfully!");
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
