<?php
/*
 * Context:
 * Login --> Update Contact Button --> Search by name --> Select --> Enter new info --> Save
 * 
 * Required Input:
 * - search criteria
 * 
 * Optional Input (At least 1) 
 * - Firstname
 * - Lastname
 * - Phone number 
 * - Email
*/
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
        
    $search = $inData["search"];
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $phoneNum = $inData["PhoneNum"];
    $email = $inData["Email"];

    $conn = new mysqli("localhost", "SmallGroup21", "group21COP4331", "COP4331"); 
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        // Find the Contact that is being updated
        $stmt = $conn->prepare("SELECT * from Contacts where (FirstName like ? OR LastName like ?) AND UserID=?");
		$name = "%" . $inData["search"] . "%";
		$stmt->bind_param("sss", $name, $name, $inData["UserID"]);
		$stmt->execute();

        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
			$id = $row["ID"];
		else
		{
			returnWithError("No Records Found");
		}
        
        // Update with new information
        $stmt = $conn->prepare("Update Contacts SET FirstName=?,LastName=?,PhoneNum=?,Email=? WHERE ID=?");
        $stmt->bind_param("sssss", $firstName, $lastName, $phoneNum, $email, $id);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithInfo($firstName, $lastName, $phoneNum, $email);
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

    function returnWithInfo( $firstName, $lastName, $phoneNum, $email )
	{
		$retValue = '{"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","PhoneNum":"' . $phoneNum . '", "Email":"' . $email . '", "error":""}';
		sendResultInfoAsJson( $retValue );
	}
    
    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>