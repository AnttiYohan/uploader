<?php

    // -----------------------------------------------------
    // - Ensure that all the recessary fields for inserting
    // - A brand are present in the payload
    // -----------------------------------------------------

    $name   = isset( $_POST["name"] )  ? $_POST["name"]  : "";
    $model  = isset( $_POST["model"] ) ? $_POST["model"] : "";

    if ( ! empty( $name ) && ! empty( $model ) )
    {    
        include_once "BrandManager.php";
        include_once "DbConnection.php";
        $manager = new BrandManager( new DbConnection() );    
        $result  = $manager->insert( $name, $model );
    }

    header("Location: http://localhost/customer/car_app");
    die();
?>
