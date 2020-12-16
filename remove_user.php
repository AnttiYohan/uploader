<?php

    // ------------------------------------------------
    // - Ensure that the "id" is sent by HTTP POST
    // - And remove the user from the database
    // ------------------------------------------------

    $id = isset( $_POST["id"] ) ? $_POST["id"] : 0;
  
    if ( $id )
    {
        include_once "UserManager.php";
        include_once "DbConnection.php";
        $manager = new UserManager( new DbConnection() );
        $result  = $manager->delete( $id );

        if ( $result )
        {
            echo "<p>User was removed</p>";
        }
        else
        {
            echo "<p>An error occured while removing the user</p>";
        }
    }


    echo '<a href="http://localhost/customer/uploader">Back to admin dashboard</a>';

?>