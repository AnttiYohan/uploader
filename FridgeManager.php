<?php

include_once "BaseManager.php";

class FridgeManager extends BaseManager
{

    /**
     * Generate HTML head for users by role
     * 
     * @param  string $role
     * @return string $html
     */
    public static function head()
    {
        $fields = [ "id", "product" ];

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
     * Reads fridges, and the products related to the fridge
     */
    public function read_all()
    {

        $fields = "*";

        return $this->db->query(

            "SELECT $fields FROM fridge_product"

        );    
    }

    /**
     * Inserts a new brand
     */
    public function insert( $name, $model )
    {
        return $this->db->write(

            "INSERT INTO `car_dlr`.`Brand` (Brand_Name, Brand_Model) VALUES(?, ?)",
            [
                $name,
                $model
            ]

        );    
    }


    /**
     * Updates a brand's name and model referenced by id
     */
    public function update( $id, $name, $model )
    {
        return $this->db->write(

            "UPDATE `car_dlr`.`Brand` SET Brand_Model = ?, Brand_Name = ? WHERE BrandID = ?",
            [
                $model,
                $name,
                $id
            ]

        );    
    }

    /**
     * Removes a brand referenced by id
     * 
     * @param  int $id
     * @return int affected rows
     */
    public function delete( $id )
    {
        return $this->db->write( 
            
            "DELETE FROM `car_dlr`.`Brand` WHERE BrandID = ?",
            [
                $id
            ]
    
        );
    }    

}