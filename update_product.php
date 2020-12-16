<?php

    // -----------------------------------------------------
    // - Ensure that all the necessary fields are present
    // - in the payload
    // - Check which car property shoulf be updated:
    // - (1) Meter reading or
    // - (2) Availability
    // -----------------------------------------------------

    $id            = isset( $_POST["id"] )          ? $_POST["id"]           : 0;
    $meter         = isset( $_POST["meter"] )       ? $_POST["meter"]        : "";
    $availability  = isset( $_POST["availablity"] ) ? $_POST["availability"] : "";

    if ( $id )
    {
        include_once "CarManager.php";
        include_once "DbConnection.php";
        $manager = new CarManager( new DbConnection() );
        $result  = 0;

        if ( strlen( $meter ) )
        {
            $result = $manager->update_meter( $id, $meter );
        }
        elseif ( strlen( $availability ) )
        {
            $result = $manager->update_availability( $id, $availability );
        }
    }

    header("Location: http://localhost/customer/car_app");
    die();
?>
