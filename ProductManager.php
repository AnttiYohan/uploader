<?php

include_once "BaseManager.php";

/**
 * Product model
 */
class ProductManager extends BaseManager
{
    /**
     * Generate HTML head for product
     * @return string $html
     */
    public static function head()
    {
        $fields =
        [ 
            "name", 
            "amount",
            "category",
            "nutrition",
            "unit"
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
     * Reads all cars from Car and Brand tables
     */
    public function read_all()
    {
        return $this->db->query( "SELECT * FROM product" );   
    }

    /**
     * Inserts a new product
     * 
     * @param  string $name
     * @param  float  $amount
     * @param  string $category
     * @param  int    $nutrition
     * @param  string $unit
     * @return int    affected rows
     */
    public function insert( $name, $amount, $category, $nutrition, $unit )
    {
        $result["product-rows"] = $this->db->write(

            "INSERT INTO product
            (
                name, 
                amount, 
                product_category, 
                nutrition_value, 
                measure_unit
            )
            VALUES(?, ?, ?, ?, ?)",
            [
                $name,
                $amount,
                $category,
                $nutrition,
                $unit
            ]

        );
        
        return $result;
    }

    /**
     * Updates a products nutritional value refereced by its name
     * 
     * @param  string $name
     * @param  float  $amount
     * @return int    affected rows
     */
    public function update_amount( $name, $amount )
    {
        return $this->db->write(

            "UPDATE product SET amount = ? WHERE name = ?",
            [ $amount, $name ]

        );    
    }    

    /**
     * Updates a products amount refereced by its name
     * 
     * @param  string $name
     * @param  int    $nutrition
     * @return int    affected rows
     */
    public function update_nutrition_value( $name, $nutrition )
    {
        return $this->db->write(

            "UPDATE product SET nutrition_value = ? WHERE name = ?",
            [ $nutrition, $name ]

        );    
    }

    /**
     * Updates a products category refereced by its name
     * 
     * @param  string $name
     * @param  string $category
     * @return int    affected rows
     */
    public function update_product_category( $name, $category )
    {
        return $this->db->write(

            "UPDATE product SET product_category = ? WHERE name = ?",
            [ $category, $name ]

        );    
    }    
 
    /**
     * Updates a products measure unit refereced by its name
     * 
     * @param  string $name
     * @param  string $unit
     * @return int    affected rows
     */
    public function update_measure_unit( $name, $unit )
    {
        return $this->db->write(

            "UPDATE product SET measure_unit = ? WHERE name = ?",
            [ $unit, $name ]

        );    
    }   
 

    /**
     * Removes a product referenced by name
     * 
     * @param  string $name
     * @return int    affected rows
     */
    public function delete( $name )
    {
        return $this->db->write( "DELETE FROM product WHERE name = ?", [ $name ] );
    } 
}