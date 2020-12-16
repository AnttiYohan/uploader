<?php

    // ------------------------------------------------
    // - Ensure that the "id" is sent by HTTP POST
    // - And remove the brand from the database
    // ------------------------------------------------

    $id = isset( $_POST["id"] ) ? $_POST["id"] : 0;
  
    if ( $id )
    {
        include_once "BrandManager.php";
        include_once "DbConnection.php";
        $manager = new BrandManager( new DbConnection() );
        $result  = $manager->delete( $id );
    }

    header("Location: http://localhost/customer/car_app");
    die();
?>