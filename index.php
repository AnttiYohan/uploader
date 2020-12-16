<?php

    // ----------------------------------------------------
    // - Create a database connection object for operations
    // ----------------------------------------------------

    include_once "DbConnection.php";

    $db = new DbConnection();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>BabyFoodWorld admin client</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" href="data:;base64,iVBORxOKGO=">
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
   </head>
  <body>
    <div id="overlay">
        <div id="popup"></div>
    </div>
    <header class="babyfoodworld">
      <img src="assets/logo-small.png" class="logo">
      <h1>Admin panel</h1>
    </header>
    <main>
 
      <!-- View container -->
      <div id="view-container" class="view">
        <?php 
          include "display_users.php";
          include "display_recipes.php";
          include "display_products.php";
          include "display_fridge.php";
        ?>
      </div>

    </main>
  </body>
</html>
<script src="./assets/js/editor.js"></script>