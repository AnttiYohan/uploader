<?php

class BaseManager
{

    public $db     = null;
    /**
     * Inject a database reference as a param
     * 
     * @param DbConnection $db
     */
    public function __construct( $db )
    {
        $this->db = $db;
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

            foreach($row as $column) 
            {
                $html .= '<td>' . $column . '</td>';
            }
 
            $html .= '</tr>';
        }
        
        return $html;
    }

    /**
     * Stub Base function, extend this into child classes
     */
    public function read_all()
    {
        return [];
    }
}