<?php

include_once "BaseManager.php";

class UserManager extends BaseManager
{


    /**
     * Generate HTML head for users by role
     * 
     * @param  string $role
     * @return string $html
     */
    public static function head()
    {

        $fields =  
        [ 
            "picture",
            "id", 
            "age", 
            "name", 
            "gender", 
            "country",
            "email",
            "fridge_id",
        ];


        $html = '<tr><th>edit</th>';

        // ---------------------------------------
        // - Iterate through the header fields
        // ---------------------------------------

        foreach ($fields as $th)
        {
            $html .= '<th>' . $th . '</th>';
        }

        $html .= '</tr>';
        
        return $html;
    }  

    /**
     * Generate HTML table rows
     * from the query result
     * 
     * @param  string $role
     * @return string $html
     */
    public function body()
    {
        $html = "";

        // ---------------------------------------
        // - Iterate through the returned rows
        // ---------------------------------------

        foreach ($this->read_all() as $row)
        {
            // ------------------------------------
            // - Display image at the first row
            // - Insert the user if into the row id
            // ------------------------------------

            $html .= 
            '<tr data-id="' . $row["id"] . 
            '"><td><img src="assets/icon_edit.svg" class="icon"></td><td class="picture"><img src="'.$row["picture_uri"].
            '" class="user-thumb"></td>';

            array_splice($row, 0, 1);

            // ------------------------------------
            // - Iterate through the columns, 
            // - give td classes names from the keys
            // ------------------------------------

            foreach($row as $key => $column) 
            {
                $html .= '<td class="' . $key . '">' . $column . '</td>';
            }
 
            $html .= '</tr>';
        }
        
        return $html;
    }

    /**
     * Reads all cars from users and Brand tables
     * 
     * @param  string $role
     * @return array  query result
     */
    public function read_all()
    {
        $fields = 
        [ 
            "picture_uri",
            "id", 
            "age", 
            "child_name", 
            "child_gender", 
            "country_from",
            "email",
            "fridge_id",
        ];

        return $this->db->query( 
            "SELECT "
            . implode(",", $fields) .
            " FROM user" 
        );    
    }


    /**
     * Inserts a new user
     * 
     * @param  integer $age
     * @param  string  $name
     * @param  string  $gender
     * @param  string  $country_from
     * @param  date    $created_at,
     * @param  string  $email
     * @param  string  $picture_uri
     * @param  date    $updated_at,
     * @param  integer $fridge_id
     * @return int    affected rows
     */
    public function insert( 
        $age, 
        $name,
        $gender,
        $country_from,
        $email,
        $password,
        $picture_uri
        )
    {

        $response = [];
        // ----------------------------------------------------------
        // - Create a fridge first, and then assign this user into it
        // ----------------------------------------------------------

        $result = $this->db->write(
            "INSERT INTO fridge (user) VALUES(?)",
            [ '0' ]
        );

        // -----------------------------------------------------------
        // - Obtain the fridge id if friedge was created succesfully
        // -----------------------------------------------------------
        $response["fridge-rows"] = $result;

        if ( $result > 0 )
        {
            $response["fridge-id"]   = $this->db->lastInsertId();
        }

        if ( $result > 0)
        {
            $result = $this->db->write(

                "INSERT INTO user
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
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $age, 
                    $name,
                    $gender,
                    $country_from,
                    date("Y-m-d h:m:s"),
                    $email,
                    $password,
                    $picture_uri,
                    date("Y-m-d h:m:s"),
                    $this->db->lastInsertId()
                ]

            );

            $response["user-rows"] = $result;
        }
        

        return $response;
    }

    /**
     * Updates a user's name refereced by id
     * 
     * @param  int    $id
     * @param  string $name
     * @return int    affected rows
     */
    public function update_age( $id, $age )
    {
        return $this->db->write(

            "UPDATE user SET age = ? WHERE id = ?",
            [ $age, $id ]

        );    
    }

    /**
     * Updates a user's email refereced by id
     * 
     * @param  int    $id
     * @param  string $email
     * @return int    affected rows
     */
    public function update_email( $id, $email )
    {
        return $this->db->write(

            "UPDATE user SET email = ? WHERE id = ?",
            [ $email, $id ]

        );    
    }    

    /**
     * Updates a user's password refereced by id
     * 
     * @param  int    $id
     * @param  string $password
     * @return int    affected rows
     */
    public function update_password( $id, $password )
    {
        return $this->db->write(

            "UPDATE user SET password = ? WHERE id = ?",
            [ $password, $id ]

        );    
    } 
    
    /**
     * Updates a user's picture_uri refereced by id
     * 
     * @param  int    $id
     * @param  string $uri
     * @return int    affected rows
     */
    public function update_pictrure_uri( $id, $uri )
    {
        return $this->db->write(

            "UPDATE user SET picture_uri = ? WHERE id = ?",
            [ $uri, $id ]

        );    
    }

    /**
     * Updates a user's country refereced by id
     * 
     * @param  int    $id
     * @param  string $courntry from
     * @return int    affected rows
     */
    public function update_country_from( $id, $country_from )
    {
        return $this->db->write(

            "UPDATE user SET country_from = ? WHERE id = ?", 
            [ $country_from, $id ]

        );    
    }         

    /**
     * Removes a user referenced by id
     * 
     * @param  int $id
     * @return int affected rows
     */
    public function delete( $id )
    {
        return $this->db->write( "DELETE FROM user WHERE id = ?", [ $id ] );
    }
}