<?php

    // -----------------------------------------------------
    // - Ensure that all the necessary fields are present
    // - in the payload to insert a new user
    // -----------------------------------------------------
    

    $age         = isset( $_POST["age"] )      ? $_POST["age"]      : "";
    $name        = isset( $_POST["name"] )     ? $_POST["name"]     : "";
    $gender      = isset( $_POST["gender"] )   ? $_POST["gender"]   : "";
    $country     = isset( $_POST["country"] )  ? $_POST["country"]  : "";
    $email       = isset( $_POST["email"] )    ? $_POST["email"]    : "";
    $password    = isset( $_POST["password"] ) ? $_POST["password"] : "";

    // -----------------------------------------
    // - Process the image here
    // -----------------------------------------

    $img_type = $_FILES["picture"]["type"];
    $img_size = $_FILES["picrure"]["size"];

    echo "<h2>Picture name: " . $_FILES["picture"]["name"] . "</h2>";
    echo "<h2>Picture tmp:  " . $_FILES["picture"]["tmp_name"] . "</h2>";

    $check = getimagesize($_FILES["picture"]["tmp_name"]);
    $img_info = [];
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["picture"]["name"]);

    if ($check)
    {
        if (move_uploaded_file($_FILES["picture"]["tmp_name"], $target_file))
        {
            $img_info[] = "Picture uploaded to: " . $target_file;
            $img_info["success"] = true; 
            $picture = $_FILES["picture"]["tmp_name"];
        }
        else
        {
            $img_info[] = "Image wasn't saved";
            $img_info["success"] = false;
            $picture = $_FILES["picture"]["tmp_name"];
        }
    }

    if ( 
            strlen( $age )      && 
            strlen( $name )     &&
            strlen( $gender )   &&
            strlen( $country )  &&
            strlen( $email )    &&
            strlen( $password )
    ) {

        if ($img_info["success"]) $picture = $target_file;
        else $picure = "/";

        include_once "UserManager.php";
        include_once "DbConnection.php";
        $manager = new UserManager( new DbConnection() );
        $result = $manager->insert( 
            $age, 
            $name,
            $gender,
            $country,
            $email,
            $password,
            $picture
        );

        $result["img-size"] = $img_size;
        $result["img-type"] = $img_type;
        $result["img-check"] = $check;

        if (isset($result["user-rows"]))
        {
            echo '<p>User rows:' . $result["user-rows"] . '</p>';
        }
        else
        {
            echo '<p>Affected user rows not found, something went wrong with user insertion</p>';
            echo '<p>Debug info:</p>';
            var_dump($result);
        }
    }
    else
    {
        echo '<p>Insufficient inputs in order to insert a new user:</p>';
    }

    echo '<a href="http://localhost/customer/uploader">Back to admin dashboard</a>';

?>