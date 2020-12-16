<div class="view__container">
  <table class="view__recipes">
    <caption>Recipes</caption>
    <thead>
        <?php
            
            // -----------------------------------------------
            // - Instantiate a RecipeManager object, and the
            // - Database connection object into it as a param
            // -----------------------------------------------

            include_once "RecipeManager.php";
            $manager = new RecipeManager( $db );
            echo RecipeManager::head();
        ?>
    </thead>
    <tbody id="recipe-records">
        <?= $manager->body(); ?>
    </tbody>
  </table>
  <!-- Recipe insertion -->
  <h4 class="view__header">Insert recipe</h4>
  <form class="view__insert" action="insert_recipe.php" method="post">
    <div class="view__frame">
        <label for="title">Title:</label>
        <input type="text" name="title">
        <label for="instructions">instructions:</label>
        <input type="text"  name="instructions">
        <label for="preparation-time">Preparation time:</label>
        <input type="number" name="preparation-time">
        <label for="age-in-months">Age(months):</label>
        <input type="number" name="age-in-months">
    </div>
    <div class="view__frame">
        <label for="youtube-link">Youtube link:</label>
        <input type="text"  name="youtube-link">
        <label for="original-link">Original link:</label>
        <input type="text"  name="original-link">
        <label for="season">Season:</label>
        <select name="season">
            <option value="SPRING">SPRING</option>
            <option value="SUMMER">SUMMER</option>
            <option value="AUTUMN">AUTUMN</option>
            <option value="WINTER">WINTER</option>            
        </select> 
    </div>
    <div class="view__frame">
        <label for="interesting-info">Interesting info:</label>
        <input type="text"   name="interesting-info">
        <label for="nutrition-value">Nutrition value:</label>
        <input type="number" name="nutrition-value">
        <label for="storage-info">Storage info:</label>
        <input type="text"   name="strorage-info">
    </div>
    <div class="view__frame">
        <label for="tips">Tips:</label>
        <input type="text"     name="tips">
        <label for="is-fingerfood">Is Fingerfood:</label>
        <input type="checkbox" name="is-fingerfood">
        <label for="fridge-id">Fridge Id:</label>
        <input type="number"   name="fridge-id">
    </div>       
    <input type="submit" value="submit">
  </form>  
</div> <!-- view__container -->