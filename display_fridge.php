<div class="view__container">
  <table class="view__fridge">
    <caption>Fridge</caption>
    <thead>
    <?php
        
        // -----------------------------------------------
        // - Instantiate a FridgeManager object, and the
        // - Database connection object into it as a param
        // -----------------------------------------------

        include_once "FridgeManager.php";
        $manager = new FridgeManager( $db );
        echo FridgeManager::head();
    ?>
    </thead>
    <tbody>
      <?= $manager->body(); ?>
    </tbody>
  </table>

  <!-- Fridge insertion -->
  <h4 class="view__header">Insert in fridge</h4>
  <form class="view__insert" action="insert_fridge.php" method="post">
    <label for="fridge">Fridge id:</label>
    <input type="number" name="fridge">
    <label for="product">Product name:</label>
        <select name="category">
                <option value="-">Select product</option>
        </select>
  </form>
</div> <!-- view__container -->