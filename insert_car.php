<?php

    // -----------------------------------------------------
    // - Ensure that all the recessary fields for inserting
    // - A car are present in the payload
    // -----------------------------------------------------

    $brand_id     = isset( $_POST["brand_id"] )     ? $_POST["brand_id"]     : 0;    
    $name         = isset( $_POST["name"] )         ? $_POST["name"]         : "";
    $availability = isset( $_POST["availability"] ) ? $_POST["availability"] : false;
    $meter        = isset( $_POST["meter"] )        ? $_POST["meter"]        : 0;    
    $type         = isset( $_POST["type"] )         ? $_POST["name"]         : "";

    if ( $brand_id && ! empty( $name ) && ! empty( $type) )
    {
        include_once "CarManager.php";
        include_once "DbConnection.php";
        $manager = new CarManager( new DbConnection() );
        $result  = $manager->insert( $brand_id, $name, $availability, $meter, $type );
    }

    header("Location: http://localhost/customer/car_app");
    die();
?>
