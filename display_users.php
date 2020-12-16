<div class="view__container">
  <table class="view__users">
    <caption>Users</caption>
    <thead>
        <?php
            
            // -----------------------------------------------
            // - Instantiate a UserManager object, and the
            // - Database connection object into it as a param
            // -----------------------------------------------

            include_once "UserManager.php";
            $user_manager = new UserManager( $db );
            echo UserManager::head();
        ?>
    </thead>
    <tbody id="user-records">
        <?= $user_manager->body(); ?>
    </tbody>
  </table>
 <!--
INSERT INTO user 
(
    age, 
    child_name, 
    child_gender,
    country_from,
    created_at,
    email,
    password,
    picture_uri,
    updated_at,
    fridge_id
)

     -->
  <!-- User Insertion ( name, email, password, recovery-info )-->
  <h4 class="view__header">Insert new user</h4>
  <form class="view__insert" enctype="multipart/form-data" action="insert_user.php" method="post">
    <label for="age">Age:</label>
    <input type="number" name="age">
    <label for="name">Name:</label>
    <input type="text"   name="name">
    <div class="view__frame">
        <p class="view__topic">Gender</p>
        <label for="male">Male:</label>
        <input type="radio" id="male" value="male" name="gender" checked>
        <label for="female">Female:</label>
        <input type="radio" id="female" value="female" name="gender">
    </div>
    <label for="country">Country:</label>
    <input type="text"   name="country">    
    <div class="view__frame">
        <label for="email">Email:</label>
        <input type="text"   name="email">
        <label for="password">Password:</label>
        <input type="password" name="password">
    </div>
    <div class="view__frame">
        <label for="picture">Profile picture:</label>
        <input type="file" name="picture">
    </div>
    <input type="submit" value="submit">
  </form>

</div> <!-- view__container -->
