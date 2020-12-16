<?php

    // -----------------------------------------------------
    // - Ensure that all the recessary fields for updating
    // - Is included in HTTP POST request payload
    // - Before updating the brand
    // -----------------------------------------------------

    $id     = isset( $_POST["id"] )    ? $_POST["id"]    : 0;
    $name   = isset( $_POST["name"] )  ? $_POST["name"]  : "";
    $model  = isset( $_POST["model"] ) ? $_POST["model"] : "";

    if ( $id && ! empty( $name ) && ! empty( $model ) )
    {
        include_once "BrandManager.php";
        include_once "DbConnection.php";
        $manager = new BrandManager( new DbConnection() );    
        $result = $manager->update( $id, $name, $model );
    }

    header("Location: http://localhost/customer/car_app");
    die();
?>
