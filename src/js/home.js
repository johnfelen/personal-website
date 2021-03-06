//NOTE: for some reason, naming this file 'index.js' gives an "Uncaught SyntaxError: Unexpected token < (index):1" error, but changing the name to anything else removes the error
var count;
var currentlyTyping;    //used to stop repeat clicking which would cause gibberish to type out
var blinkingTime;    //holds the timeout on the blink funciton
var countingTime;    //holds the interval on the countDown/formattedTimeLeft function(s)
var nextCharTime;    //holds the timeout for the typring of the next char

if( isFileInURL( "index" ) || getPath() === "" )
{
    displayIndex();
}

function displayIndex()
{
    //clear all the global variables for index;
    count = 0;
    currentlyTyping = false;
    clearTimeout( blinkingTime );
    clearTimeout( nextCharTime );
    clearInterval( countingTime );

    var chars;
    var currentCharIndex;

    if( getCurrTimeSec() < sessionStorage.getItem( "time_finished" ) )   //for after the game has frozen, simplified, no animation, appending for when user is at static page
    {
        $.ajax({
            url: "./server_functionality/pokemon-text.php",
            type: "GET",
            data: { getText : true },
            dataType: "json",
            success: function( textToBeDisplayed )
            {
                //make the picture of me and count down immediately visible
                countDown();
                toggleVisibility( "#blink" );
                toggleVisibility( "#picture-of-me" );

                var lines = textToBeDisplayed.slice( 0, 7 ).join( "<br>" );
                $( "#pokemon" ).html( lines );

                var nameTable = textToBeDisplayed[ 7 ] + "<br>";
                $( "#names" ).html( nameTable );
                toggleVisibility( "#" + sessionStorage.getItem( "selected_name" ) );  //will put the name that they selected back for when the static page is loaded
                $( window ).trigger( "resize" );

                var frozenSpinner = textToBeDisplayed[ 9 ] + "<br>";
                $( "#continue" ).html( frozenSpinner );

                var brokenMessage = textToBeDisplayed[ 10 ] + "<br>";
                $( "#broken" ).html( brokenMessage );

                timeFinishedSec = parseInt( sessionStorage.getItem( "time_finished" ) );
                diff = timeFinishedSec - getCurrTimeSec();
                $( "#time-left" ).html( formattedTimeLeft() );
            }
        });
    }

    else  //functionality for the animated pokemon text
    {
        $( "#main-container" ).click( function()
        {
            printNextLine();
        });

        $.ajax({    //use an ajax call to get the text that will be displayed, after we get that start the fade in and start displaying the text, NOTE: I took away the document.ready to speed up the start time of when the picture starts to fade in since the AJAX call already takes time and will finish after document is ready at normal speeds
            url: "./server_functionality/pokemon-text.php",
            type: "GET",
            data: { getText : true },
            dataType: "json",
            success: function( textToBeDisplayed )
            {
                lines = textToBeDisplayed.slice( 0, 7 );
                nameTable = textToBeDisplayed[ 7 ];
                movingSpinner = textToBeDisplayed[ 8 ];
                frozenSpinner = textToBeDisplayed[ 9 ];
                brokenMessage = textToBeDisplayed[ 10 ];

                setTimeout( function()  //this timeout has the fadeIn happen after the starting page animations finish
                {
                    $( "#picture-of-me" ).fadeTo( 3000, 1, function()
                    {
                        printNextLine();
                        blink();
                    });
                }, 1000 );
            }
        });
    }
}

$( window ).resize( function()  //is a resize handler so that the pick the name portion of the index.php page has all the names on the same line for normal screens
{
    $( "#names" ).children( "div" ).each( function( i )
    {
        if( $( window ).width() <= 1440 )
        {
            if( i === 1 )
            {
                $( this ).removeClass( "col-xs-4" );
                $( this ).addClass( "col-xs-6" );
            }

            else
            {
                $( this ).removeClass( "col-xs-4" );
                $( this ).addClass( "col-xs-3" );
            }
        }

        else
        {
            if( i === 1 )
            {
                $( this ).removeClass( "col-xs-6" );
                $( this ).addClass( "col-xs-4" );
            }

            else
            {
                $( this ).removeClass( "col-xs-3" );
                $( this ).addClass( "col-xs-4" );
            }
        }
    });
});

$( window ).unload( function()  //backup incase they do a traditional unload by refreshing or hitting on of the direcitonal buttons
{
    indexUnload();
});

function indexUnload()  //set session storage( since if they restart the browser they it counts as fixing the "game" ) with the time that the page will reload, also reset the global variables so when AJAX linking back to the page it starts as normal
{
    if( typeof timeFinishedSec !== "undefined" )
    {
        sessionStorage.setItem( "time_finished", timeFinishedSec );
    }
}

function countDown()    //will keep outputting how many minutes/seconds the user has left until the "game" will work again, so when zero seconds left redirect to index.php
{
    if( typeof timeFinishedSec === "undefined" )   //this is a new countdown
    {
        timeFinishedSec = getCurrTimeSec() + 900;
        diff = timeFinishedSec - getCurrTimeSec();
    }

    countingTime = setInterval( function()
    {
        diff--;
        $( "#time-left" ).html( formattedTimeLeft() );
    }, 1000 );
}

function formattedTimeLeft()    //update text with minutes and seconds to be gramatically correct and concise, removes sessionStorage and cookie when 15 minutes has been up
{
    if( diff <= 0 )
    {
        sessionStorage.removeItem( "time_finished" );
        sessionStorage.removeItem( "selected_name" );
        timeFinishedSec = undefined;

        if( isFileInURL( "index" ) || getPath() === "" )
        {
            window.location.href = "./index.php";
        }
    }

    var pluralSec = ( ( diff % 60 ) === 1 ) ? "" : "s";
    var pluralMin = ( parseInt( diff / 60 ) === 1 ) ? "" : "s";

    if( diff < 60 )
    {
        return ( ( diff % 60 ) + " second" + pluralSec );
    }

    else if( ( diff % 60 ) === 0 )
    {
        return ( parseInt( diff / 60 ) + " minute" + pluralMin );
    }

    else
    {
        return ( parseInt( diff / 60 ) + " minute" + pluralMin + " and " + ( diff % 60 ) + " second" + pluralSec );
    }
}

function getCurrTimeSec()
{
    return parseInt( new Date().getTime() / 1000 );
}

function printNextLine()    //animates the typing characters, based on the last response in http://stackoverflow.com/questions/23688149/simulate-the-look-of-typing-not-the-actual-keypresses-in-javascript
{
    if( count < lines.length && !currentlyTyping )  //get the chars in an array and send them to be printed out, setting currenlyTyping to true will stop the blinking
    {
        currentlyTyping = true;
        chars = lines[ count ].split( "" );
        currentCharIndex = 0;
        printNextChar();
    }

    else if( count === lines.length )   //print out the name chosing table
    {
        $( "#names" ).html( nameTable + "<br>" );
        $( window ).trigger( "resize" );

        $( "#choose-name tr" ).each( function() //allows the to choose the name a la pokemon sideways triangle buttons
        {
            $( this ).hover( function()
            {
                toggleVisibility( $( this ).find( "i" ) );
            }, function()
            {
                toggleVisibility( $( this ).find( "i" ) );
            });

            $( this ).click( function()
            {
                sessionStorage.setItem( "selected_name", $( this ).find( "i" ).attr( "id" ) );
            });
        });

        $( "#main-container" ).off( "click" );
        $( "#choose-name" ).click( function()
        {
            printNextLine();
        });
        count++;
    }

    else if( count === lines.length + 1 )    //print out spinner to simulate loading and stop the table from highlighting on hover
    {
        $( "tr" ).removeClass();
        $( "#continue" ).html( movingSpinner + "<br>" );
        $( "#choose-name tr" ).unbind( "mouseenter mouseleave" );   //saves the name that the client chose on the table
        $( "#choose-name tr" ).off( "click" );
        count++;

        setTimeout( function()  //the timeout is to show the loading spinner for three seconds and then freeze the game
        {
            countDown();
            $( "#continue" ).html( frozenSpinner + "<br>" );
            $( "#broken" ).html( brokenMessage + "<br>" );
        }, 3000 );
    }
}

function printNextChar()
{
    if( currentCharIndex == chars.length )  //base case
    {
        $( "#pokemon" ).append( "<br>" );
        count++;
        currentlyTyping = false;
        return;
    }

    else if( ( chars[ currentCharIndex ] === "." || chars[ currentCharIndex ] === "!" ) && chars[ currentCharIndex + 1 ] === " " )  //this is just to be uniform so I can have double spaces at the end of a sentence since nbsp; will be printed out if I have it in the chars array
    {
        $( "#pokemon" ).append( chars[ currentCharIndex ] + " &nbsp;" );
        currentCharIndex += 2;
    }

    else
    {
        $( "#pokemon" ).append( chars[ currentCharIndex ] );
        currentCharIndex++;
    }

    nextChar = setTimeout( printNextChar, 40 );
}

function blink()    //based on second last response on http://stackoverflow.com/questions/18105152/alternative-for-blink since the actual <blink> tag is deprecated, I wonder why
{
    var blinks = $( "#blink" );
    for ( var i = blinks.length - 1; i >= 0; i-- )
    {
        var s = blinks[ i ];

        if( currentlyTyping )
        {
            $( "#blink" ).fadeTo( 0, 0 );
        }

        else if( count === lines.length + 1 )    //they now can "choose" their name so change "click to continue" to "choose your name", because of the below else if must have the s.style.visibility line
        {
            $( "#continue" ).html( "Choose Your Name<br>" );
            toggleVisibility( "#blink" );
        }

        else if( count === lines.length + 2 )    //we are done with blinking, make the text visible so the "loading" simulation will show
        {
            $( "#blink" ).fadeTo( 0, 1 );
            return;
        }

        else if( count > 0 )    //the > 0 is to stop from having the short flash of click to continue when the page loads
        {
            toggleVisibility( "#blink" );
        }
    }

    blinkingTime = setTimeout( blink, 350 );
}

function toggleVisibility( element ) //uses an immediate fadeTo toggle if an object is shown( opacity is used instead of visibility since it is sort of glichy )
{
    if( $( element ).css( "opacity" ) == 1 )    //no typecheck, it is technically a string check
    {
        $( element ).fadeTo( 0, 0 );
    }

    else
    {
        $( element ).fadeTo( 0, 1 );
    }
}
