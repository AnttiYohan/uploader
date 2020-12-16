<?php

    // ------------------------------------------------
    // - Ensure that the "id" is sent by HTTP POST
    // - And remove the booking from the database
    // ------------------------------------------------

    $id = isset( $_POST["id"] ) ? $_POST["id"] : 0;
  
    if ( $id )
    {
        include_once "BookingManager.php";
        include_once "DbConnection.php";
        $manager = new BookingManager( new DbConnection() );
        $result  = $manager->delete( $id );

    }

    header("Location: http://localhost/customer/car_app");
    die();
?>