<?php

    // -----------------------------------------------------
    // - Ensure that all the necessary fields are present
    // - in the payload
    // - Check which user property should be updated:
    // - (1) age
    // - (2) Email
    // - (3) Password
    // -----------------------------------------------------

    $id               = isset( $_POST["id"] )               ? $_POST["id"]               : 0;
    $instructions     = isset( $_POST["instructions"] )     ? $_POST["instructions"]     : "";
    $preparation_time = isset( $_POST["preparation_time"] ) ? $_POST["preparation_time"] : 0;    
    $months_old       = isset( $_POST["months_old"] )       ? $_POST["months_old"]       : 0;
    $youtube_link     = isset( $_POST["youtube_link"] )     ? $_POST["youtube_link"]     : "";
    $interesting_info = isset( $_POST["interesting_info"] ) ? $_POST["interesting_info"] : "";
    $nutrition_value  = isset( $_POST["nutrition_value"] )  ? $_POST["nutrition_value"]  : 0;    
    $storage_info     = isset( $_POST["storage_info"] )     ? $_POST["storage_info"]     : "";
    $tips             = isset( $_POST["tips"] )             ? $_POST["tips"]             : "";
    $is_fingerfood    = isset( $_POST["is_fingerfood"])     ? $_POST["is_fingerfood"]    : "";
    $fridge_id        = isset( $_POST["fridge_id"])         ? $_POST["fridge_id"]        : 0;
        

    if ( $id )
    {
        include_once "RecipeManager.php";
        include_once "DbConnection.php";
        $manager = new RecipeManager( new DbConnection() );
        $result  = 0;

        // --------------------------------------------------------------
        // - Choose the property to be updated based on what is present
        // - in the request payload
        // --------------------------------------------------------------

        if ( strlen($instructions) )
        {
            $result = $manager->update_instructions( $id, $instructions );
        }
        else if ( $preparation_time )
        {
            $result = $manager->update_preparation_time( $id, $preparation_time );
        }
        else if ( $months_old )
        {
            $result = $manager->update_moths_old( $id, $months_old );
        }
        else if ( strlen($youtube_link) )
        {
            $result = $manager->update_youtube_link( $id, $youtube_link );
        }
        else if ( strlen($interesting_info) )
        {
            $result = $manager->update_interesting_info( $id, $interesting_info );
        }
        else if ( $nutrition_value )
        {
            $result = $manager->update_nutrition_value( $id, $nutrition_value );
        }
        else if ( strlen($storage_info) )
        {
            $result = $manager->update_storage_info( $id, $strorage_info );
        }
        else if ( strlen($tips) )
        {
            $result = $manager->update_tips( $id, $tips );
        }
        else if ( strlen($is_fingerfood) )
        {
            $result = $manager->update_is_fingerfood( $id, $is_fingerfood );
        }
        else if ( $fridge_id )
        {
            $result = $manager->update_fridge_id( $id, $fridge_id );
        }

        if ( $result )
        {
            echo "<p>Recipe was updated</p>";
        }
        else
        {
            echo "<p>An error occured while updating the recipe</p>";
        }   
    }
    else
    {
        echo "<p>Recipe id must be present in order to update the correct recipe</p>";   
    }

    echo '<a href="http://localhost/customer/uploader">Back to admin dashboard</a>'; 
?>
