<div class="view__container">
  <table class="view__products">
    <caption>Products</caption>
    <thead>
        <?php
            
            // -----------------------------------------------
            // - Instantiate a ProductManager object, and the
            // - Database connection object into it as a param
            // -----------------------------------------------

            include_once "ProductManager.php";
            $manager = new ProductManager( $db );
            echo ProductManager::head();
        ?>
    </thead>
    <tbody>
        <?= $manager->body(); ?>
    </tbody>
  </table>
  <!-- Product insertion -->
  <h4 class="view__header">Insert new product</h4>
  <form class="view__insert" action="insert_product.php" method="post">
    <label for="name">Name:</label>
    <input type="text"  name="name">
    <label for="amount">Amount:</label>
    <input type="number"  name="amount">
    <label for="nutrition">Nutrition value:</label>
    <input type="number"  name="nutrition">
    <div class="view__frame">
        <label for="category">Product category:</label>
        <select name="category">
                <option value="BREAD_AND_PASTRY">Bread and pastry</option>
                <option value="FRUITS">Fruits</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="SPICES">Spices</option>
                <option value="GRAINS">Grains</option>
                <option value="DAIRY">Dairy</option>
                <option value="MEAT">Meat</option>
                <option value="SEAFOOD">Seafood</option>
                <option value="DRINKS">Drinks</option>
                <option value="FROZEN_AND_CONVENIENCE">Frozen and convenience</option>
                <option value="OTHERS">Others</option>
                <option value="NONE">None</option> 
        </select>
        <label for="unit">Measure unit:</label>
        <select name="unit">
                <option value="ML">ml</option>
                <option value="LITER">Liter</option>
                <option value="GR">gr</option>
                <option value="KG">kg</option> 
                <option value="PIECES">Pieces</option>
                <option value="CUP">Cup</option>    
                <option value="CUPS">Cups</option>
                <option value="TSP">Tsp</option>    
                <option value="TBSP">Tbsp</option>
                <option value="PINCH">Pinch</option>
                <option value="CLOVE">Clove</option>
                <option value="CAN">Can</option>    
                <option value="CANS">Cans</option>
                <option value="SLICE">Slice</option>    
                <option value="SLICES">Slices</option>
                <option value="NONE">None</option>                                       
        </select>
    </div>
    <input type="submit" value="submit">
  </form>  

</div> <!-- view__container -->