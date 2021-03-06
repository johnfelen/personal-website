<?php
    if( isset( $_GET[ "name" ] ) )
    {
        $portfolioData = new PortfolioSort( "NAME", $_GET[ "name" ] );
        unset( $_GET[ "name" ] );
    }

    else if( isset( $_GET[ "lang" ] ) )
    {
        $portfolioData = new PortfolioSort( "LANG", $_GET[ "lang" ] );
        unset( $_GET[ "lang" ] );
    }

    else if( isset( $_GET[ "time" ] ) )
    {
        $portfolioData = new PortfolioSort( "TIME", $_GET[ "time" ] );
        unset( $_GET[ "time" ] );
    }

    $outputData = [ $portfolioData->getSortButtonVals(), $portfolioData->getSortedProjects() ];
    echo json_encode( $outputData );

    class PortfolioSort
    {
        function __construct( $sortType, $currSorter )  //$sortType is either NAME, TIME, LANG and $currSorter is either fa-sort-asc or fa-sort-desc
        {
            include( "./database-setup.php" );
            $this->portfolioDB = $genericDB;
            $this->sortType = $sortType;
            $this->sortButton = [
                "name" => "",
                "nextName" => "",
                "time" => "",
                "nextTime" => "",
                "lang" => "",
                "nextLang" => ""
            ];

            if( $sortType === "NAME" )
            {
                $this->sortButton[ "name" ] = $currSorter;
                $this->sortButton[ "nextName" ] = $this->getNextHref( $this->sortButton[ "name" ] );
                $this->result = $this->queryProjects( $this->sortButton[ "name" ], "Name" );
            }

            else if( $sortType === "TIME" )
            {
                $this->sortButton[ "time" ] = $currSorter;
                $this->sortButton[ "nextTime" ] = $this->getNextHref( $this->sortButton[ "time" ] );
                $this->result = $this->queryProjects( $this->sortButton[ "time" ], "Month Finished" );
            }

            else if( $sortType === "LANG" )
            {
                $this->sortButton[ "lang" ] = $currSorter;
                $this->sortButton[ "nextLang" ] = $this->getNextHref( $this->sortButton[ "lang" ] );
                $this->result = $this->queryProjects( $this->sortButton[ "lang" ], "Programming Languages" );
            }

            $this->setOtherSortButtonVals( $sortType );
        }

        function __destruct()
        {
            mysqli_close( $this->portfolioDB );
        }

        public function getSortButtonVals()  //returns the sort buttons and links to be printed out so they pass the next sort information with GET correctly
        {
            return "
            <ul id=\"sort-buttons\" class=\"nav nav-pills nav-justified font-main\">
                <li><a class=\"nav-btn\" id=\"name={$this->sortButton[ "nextName" ]}\" href=\"#\">Name of Project <i class=\"fa {$this->sortButton[ "name" ]}\"></i></a></li>
                <li><a class=\"nav-btn\" id=\"lang={$this->sortButton[ "nextLang" ]}\" href=\"#\">Programming Languages <i class=\"fa {$this->sortButton[ "lang" ]}\"></i></a></li>
                <li><a class=\"nav-btn\" id=\"time={$this->sortButton[ "nextTime" ]}\" href=\"#\">Time Finished <i class=\"fa {$this->sortButton[ "time" ]}\"></i></a></li>
            </ul>";
        }

        public function getSortedProjects() //return all the projects and their descriptions formatted for the webpage
        {
            $currComparator = "";

            $output = "<hr class=\"color-border\">";
            while( $row = $this->result->fetch_assoc() )
            {
                $newTier = $this->getTierChange( $row, $currComparator );
                $currComparator = $newTier[ 1 ];

                $output .= $newTier[ 0 ];
                $output .= "
                <hr class=\"color-border\">
                <div class=\"row vertical-center\">
                    <div class=\"col-xs-3\">
                        <p class=\"font-title font-large font-center colored-link rotate\" id=\"{$row[ "Name" ]}\">
                            <a href=\"{$row[ "Link" ]}\" title=\"{$row[ "Link" ]}\" target=\"_blank\">{$row[ "Name" ]}</a>
                        </p>
                    </div>

                    <div class=\"col-xs-9\">
                        <p class=\"font-main font-center font-small color colored-link\">{$row[ "Description" ]}</p>
                    </div>
                </div>
                <hr class=\"color-border\">";
            }
            $output .= "<hr class=\"color-border\">";


            return $output;
        }

        private function setOtherSortButtonVals()    //will set the other variables for the sort buttons to be printed out
        {
            foreach( $this->sortButton as $key => $value )
            {
                if( strcmp( substr( $key, 0, 4 ), "next" ) === 0 && $value === "" ) //the button is not being sorted on so if the button is clicked it will do ascending sort
                {
                    $this->sortButton[ $key ] = "fa-sort-asc";
                }

                else if( $value === "" )
                {
                    $this->sortButton[ $key ] = "fa-sort";
                }
            }
        }

        private function getTierChange( $row, $currComparator ) //returns a tier change (such as the programming language changes) with the currComparator so the object can keep track of it (witout making it an object variable since it is only used in this method and the method that calls it getSortedProjects())
        {
            $prevComparator = $currComparator;
            if( $this->sortType === "NAME" && $currComparator !== $row[ "Name" ][ 0 ] )
            {
                $currComparator = $row[ "Name" ][ 0 ];
            }

            else if( $this->sortType === "TIME" && $currComparator !== date( "Y", strtotime( $row[ "Month Finished" ] ) ) )
            {
                $currComparator = date( "Y", strtotime( $row[ "Month Finished" ] ) );
            }

            else if( $this->sortType === "LANG" && $currComparator !== $row[ "Programming Languages" ] )
            {
                $currComparator = $row[ "Programming Languages" ];
            }

            if( $prevComparator !== $currComparator )
            {
                if( $this->sortType !== "LANG" )
                {
                    return [ "<p class=\"font-title font-header font-center color colored-link\"><a id=\"{$currComparator}\" href=\"https://en.wikipedia.org/wiki/{$currComparator}\" target=\"_blank\">{$currComparator} </a></p>", $currComparator ];
                }

                else    //the language has some edge cases because of wikipedia disambiguation and there can be more than one programming language per project
                {
                    $languages = explode( " ", $currComparator );
                    $result = "<p class=\"font-title font-header font-center color colored-link\">";
                    for( $i = 0; $i < count( $languages ); $i++ )
                    {
                        $result .= "<a id=\"{$languages[ $i ]}_{$i}\" href=\"https://en.wikipedia.org/wiki/{$languages[ $i ]}_(programming_language)\" target=\"_blank\">{$languages[ $i ]}</a> ";
                    }
                    return [ "{$result}</p>", $currComparator ];
                }
            }

            else
            {
                return [ "", $currComparator ];
            }
        }

        private function getNextHref( $currHref )   //figures out which sorting button should be printed out
        {
            if( $currHref === "fa-sort" )
            {
                return "fa-sort-asc";
            }

            else if( $currHref === "fa-sort-asc" )
            {
                return "fa-sort-desc";
            }

            else
            {
                return "fa-sort-asc";
            }
        }

        private function queryProjects( $currSortChoice, $orderAttribute )  //query the order of the projects taht will be displayed
        {
            if( $currSortChoice === "fa-sort-asc" )
            {
                $result = $this->portfolioDB->query( "SELECT * FROM `project descriptions` ORDER BY `{$orderAttribute}` ASC" );
            }

            else if( $currSortChoice === "fa-sort-desc" )
            {
                $result = $this->portfolioDB->query( "SELECT * FROM `project descriptions` ORDER BY `{$orderAttribute}` DESC" );
            }

            if( !$result )
            {
                die( "Error with query." );
            }

            else
            {
                return $result;
            }
        }
    }
?>
