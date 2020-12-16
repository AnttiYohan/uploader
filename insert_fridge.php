<?php

    // -----------------------------------------------------
    // - Ensure that all the necessary fields are present
    // - in the payload to insert a new booking
    // -----------------------------------------------------

    $title            = isset( $_POST["title"] )            ? $_POST["title"]            : "";
    $instructions     = isset( $_POST["instructions"] )     ? $_POST["instructions"]     : "";
    $preparation_time = isset( $_POST["preparation_time"] ) ? $_POST["preparation_time"] : 0;    
    $months_old       = isset( $_POST["months_old"] )       ? $_POST["months_old"]       : 0;
    $youtube_link     = isset( $_POST["youtube_link"] )     ? $_POST["youtube_link"]     : "";
    $original_link    = isset( $_POST["original_link"] )    ? $_POST["original_link"]    : "";    
    $season           = isset( $_POST["season"] )           ? $_POST["season"]           : "";
    $interesting_info = isset( $_POST["interesting_info"] ) ? $_POST["interesting_info"] : "";
    $nutrition_value  = isset( $_POST["nutrition_value"] )  ? $_POST["nutrition_value"]  : 0;    
    $storage_info     = isset( $_POST["storage_info"] )     ? $_POST["storage_info"]     : "";
    $tips             = isset( $_POST["tips"] )             ? $_POST["tips"]             : "";
    $is_fingerfood    = isset( $_POST["is_fingerfood"])     ? $_POST["is_fingerfood"]    : false;
    $fridge_id        = isset( $_POST["fridge_id"] )        ? $_POST["fridge_id"]        : 0;    


    if ( 
        strlen($title)          &&
        strlen($instructions)   &&
        $preparation_time       &&
        $months_old             &&
        strlen($season)         &&
        $fridge_id
     )
    {
        include_once "RecipeManager.php";
        include_once "DbConnection.php";
        $manager = new RecipeManager( new DbConnection() );
        $result  = $manager->insert(

            $title,
            $instructions,
            $preparation_time,
            $months_old,
            $youtube_link,
            $original_link,
            $season,
            $interesting_info,
            $nutrition_value,
            $storage_info,
            $tips,
            $is_fingerfood,
            $fridge_id          

        );

        if ($result)
        {
            echo '<p>Recipe rows:' . $result . '</p>';
        }
        else
        {
            echo '<p>Affected recipe rows not found, something went wrong with recipe insertion</p>';
            echo '<p>Debug info:</p>';
            var_dump($result);
        }
    }
    else
    {
        echo '<p>Insufficient inputs in order to insert a new recipe:</p>';
    }

    echo '<a href="http://localhost/customer/uploader">Back to admin dashboard</a>';

?>