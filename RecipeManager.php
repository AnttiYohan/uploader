<?php

include_once "BaseManager.php";

/**
 * Booking model
 */
class RecipeManager extends BaseManager
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
            "title",
            "instructions",
            "preparation_time",
            "months",
            "youtube",
            "link",
            "season",
            "info",
            "nutrition",
            "storage",
            "tips",
            "fridge",
            "fingerfood"
        ];

        $html = '<tr>';

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
            $html .= '<tr>';

            // ----------------------------------
            // - Iterate through the columns
            // ----------------------------------

            $fingerfood_flag = $row["is_fingerfood"] > 0 ? true : false;
            
            unset($row["is_fingerfood"]);

            foreach($row as $column) 
            {
                $html .= '<td>' . $column . '</td>';
            }
 
            $html .= '<td>';
            
            $html .= $fingerfood_flag ? 'YES' : '-';
            $html .= '</td></tr>';
            
        }
        
        return $html;
    }
    /**
     * Reads bookings from a view designed for a role
     * 
     * @param  string $role
     * @return array  query result
     */
    public function read_all()
    {
        return $this->db->query( 
            "SELECT
                title,
                instructions,
                preparation_time,
                months_old,
                youtube_link,
                original_link,
                season,
                interesting_info,
                nutrition_value,
                storage_info,
                tips,
                is_fingerfood,
                fridge_id
            FROM recipe" );
    }

    /**
     * Inserts a new booking
     * 
     * @param  int    $car_id
     * @param  int    $user_id
     * @param  string $date
     * @param  string $deposit
     * @param  string $dispatch
     * @param  string $return
     * @param  string $status
     * @return int    affected rows    
     */
    public function insert(

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

        )
    {
        $response = [];

        // -----------------------------------------------------------
        // - Obtain the fridge id if friedge was created succesfully
        // -----------------------------------------------------------
 

            $result = $this->db->write(

                "INSERT INTO recipe
                (
                    title,
                    instructions,
                    preparation_time,
                    months_old,
                    youtube_link,
                    original_link,
                    season,
                    interesting_info,
                    nutrition_value,
                    storage_info,
                    tips,
                    is_fingerfood,
                    updated_at,
                    fridge_id, 
                )
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
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
                    date("Y-m-d h:m:s"),
                    $fridge_id
                ]

            );

            $response["user-rows"] = $result;
        
        return $response;  
    }

    /**
     * Updates a recipe instructions
     * 
     * @param  int    $id
     * @param  string $instructions
     * @return int    affected rows
     */
    public function update_instructions( $id, $instructions )
    {
        return $this->db->write(

            "UPDATE recipe SET instructions = ? WHERE id = ?",
            [ $instructions, $id ]

        );    
    }  

    /**
     * Updates a recipe prep time
     * 
     * @param  int    $id
     * @param  int    $preparation_time
     * @return int    affected rows
     */
    public function update_preparation_time( $id, $preparation_time )
    {
        return $this->db->write(

            "UPDATE recipe SET preparation_time = ? WHERE id = ?",
            [ $preparation_time, $id ]

        );    
    }  

    /**
     * Updates a recipe age recommendation
     * 
     * @param  int    $id
     * @param  int    $moths_old
     * @return int    affected rows
     */
    public function update_months_old( $id, $moths_old )
    {
        return $this->db->write(

            "UPDATE recipe SET months_old = ? WHERE id = ?",
            [ $months_old, $id ]

        );    
    } 

    /**
     * Updates a recipe youtube link
     * 
     * @param  int    $id
     * @param  string $youtube_link
     * @return int    affected rows
     */
    public function update_youtube_link( $id, $youtube_link )
    {
        return $this->db->write(

            "UPDATE recipe SET youtube_link = ? WHERE id = ?",
            [ $youtube_link, $id ]

        );    
    }
    
    /**
     * Updates a recipe interesting info
     * 
     * @param  int    $id
     * @param  string $interesting info
     * @return int    affected rows
     */
    public function update_interesting_info( $id, $interesting_info )
    {
        return $this->db->write(

            "UPDATE recipe SET interesting_info = ? WHERE id = ?",
            [ $interesting_info, $id ]

        );    
    }      

    /**
     * Updates a recipe nutrition value
     * 
     * @param  int    $id
     * @param  int    $nutrition_value
     * @return int    affected rows
     */
    public function update_nutrition_value( $id, $nutrition_value )
    {
        return $this->db->write(

            "UPDATE recipe SET nutrition_value = ? WHERE id = ?",
            [ $nutrition_value, $id ]

        );    
    }
    
    /**
     * Updates a recipe storage info
     * 
     * @param  int    $id
     * @param  string $storage_info
     * @return int    affected rows
     */
    public function update_strorage_info( $id, $storage_info )
    {
        return $this->db->write(

            "UPDATE recipe SET storage_info = ? WHERE id = ?",
            [ $storage_info, $id ]

        );    
    } 
    
    /**
     * Updates a recipe tips
     * 
     * @param  int    $id
     * @param  string $tips
     * @return int    affected rows
     */
    public function update_tips( $id, $tips )
    {
        return $this->db->write(

            "UPDATE recipe SET tips = ? WHERE id = ?",
            [ $tips, $id ]

        );    
    }

    /**
     * Updates a recipe is fingerfood
     * 
     * @param  int    $id
     * @param  bool   $is_fingerbood
     * @return int    affected rows
     */
    public function update_is_fingerfood( $id, $is_fingerfood )
    {
        return $this->db->write(

            "UPDATE recipe SET is_fingerfood = ? WHERE id = ?",
            [ $is_fingerfood, $id ]

        );    
    }

    /**
     * Updates a recipe fridge_id
     * 
     * @param  int    $id
     * @param  int    $fridge_id
     * @return int    affected rows
     */
    public function update_fridge_id( $id, $fridge_id )
    {
        return $this->db->write(

            "UPDATE recipe SET fridge_id = ? WHERE id = ?",
            [ $fridge_id, $id ]

        );    
    }    


    /**
     * Removes a recipe
     * 
     * @param  int $id
     * @return int affected rows
     */
    public function delete( $id )
    {
        return $this->db->write( "DELETE FROM recipe WHERE id = ?", [ $id ] );
    } 
}