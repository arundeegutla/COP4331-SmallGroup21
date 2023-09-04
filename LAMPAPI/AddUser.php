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

	$conn = new mysqli("localhost", "SmallGroup21", "group21COP4331", "COP4331");
	if ($conn->connect_error) {
		returnWithError("cant connect to database");
	}
	else
	{
		$firstName = $inData["FirstName"];
		$lastName = $inData["LastName"];
		$username = $inData["Username"];
		$passwd = $inData["Passwd"];

		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Username,Passwd) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $username, $passwd);
		$stmt->execute();

		$stmt2 = $conn->prepare("SELECT ID FROM Users WHERE Username=? AND Passwd=?");
		$stmt2->bind_param("ss", $username, $passwd);
		$stmt2->execute();
		$result = $stmt2->get_result();

		if($row = $result->fetch_assoc())
		{
			returnWithInfo($row['ID']);
		}
		else
		{
			returnWithError("Cannot Create User");
		}

		$stmt->close();

		$stmt2 = $conn->prepare("SELECT ID FROM Users WHERE Username=? AND Passwd =?");
		$stmt2->bind_param("ss", $username, $passwd);
		$stmt2->execute();
		$result = $stmt2->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['ID'] );
		}

		$stmt2->close();
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

	function returnWithInfo( $id )
	{
		$retValue = '{"ID":"' . $id . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
