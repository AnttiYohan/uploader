<?php

    // -----------------------------------------------------
    // - Ensure that all the necessary fields are present
    // - in the payload
    // - Check which user property should be updated:
    // - (1) age
    // - (2) Email
    // - (3) Password
    // -----------------------------------------------------

    $id          = isset( $_POST["id"] )          ? $_POST["id"]            : 0;
    $age         = isset( $_POST["age"] )         ? $_POST["age"]           : "";
    $email       = isset( $_POST["email"] )       ? $_POST["email"]         : "";
    $password    = isset( $_POST["password"] )    ? $_POST["password"]      : "";


    if ( $id )
    {
        include_once "UserManager.php";
        include_once "DbConnection.php";
        $manager = new UserManager( new DbConnection() );
        $result  = 0;

        if ( strlen( $age ) )
        {
            $result = $manager->update_age( $id, $age );
        }

        if ( $result )
        {
            echo "<p>User was updated</p>";
        }
        else
        {
            echo "<p>An error occured while updating the user</p>";
        }        
    }
    else
    {
        echo "<p>User id must be present in order to update the correct user</p>";   
    }

    echo '<a href="http://localhost/customer/uploader">Back to admin dashboard</a>'; 
?>
