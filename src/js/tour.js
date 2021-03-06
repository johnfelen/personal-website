if( localStorage.getItem( "tour_start" ) === null && isFileInURL( "tour" ) )   //go to previous page if the tour has not started and they tried to get to tour.php
{
    window.history.back();
}

var tour = new Tour({
    steps: [
    {
        element: "#main-nav",
        title: "Main Navbar",
        // content: "Page links to Home, Portfolio, Blog, and Contact Me.",
        content: "Page links to Home, Portfolio, and Contact Me.",
        placement: "bottom"
    },
    {
        element: "#tour-theme-menu",
        title: "Theme Menu",
        content: "On any page, hover over the icon here to dipslay the theme menu for the website.",
        placement: "right"
    },
    {
        element: "#main-container",
        title: "Main Container",
        content: "The main information on each page is placed inside this container.",
        placement: "top"
    },
    {
        element: "#right-footer-links",
        title: "Right Footer Links",
        content: "Links to my Github, Facebook( if you still use it, I don't ), and LinkedIn.",
        placement: "left"
    },
    {
        element: "#left-footer-links",
        title: "Left Footer Links",
        content: "Click the Signpost to restart the tour, the @ to send me an email, and the File to view my Résumé.",
        placement: "right"
    }],
    //template based on the default template at http://bootstraptour.com/api/
    template: ""+
    "<div class=\"popover tour color-container\">" +
        "<div class=\"arrow color\"></div>" +
        "<h3 class=\"popover-title color-reverse font-title\"></h3>" +
        "<div class=\"popover-content color font-main font-center\"></div>" +
        "<nav class=\"popover-navigation\">" +
            "<button class=\"btn btn-default btn-color\" data-role=\"prev\">&nbsp;&nbsp;<i class=\"fa fa-step-backward\"></i>&nbsp;&nbsp;</button>" +
            "<button class=\"btn btn-default btn-color\" data-role=\"next\">&nbsp;&nbsp;<i class=\"fa fa-step-forward\"></i>&nbsp;&nbsp;</button>" +
            "<button class=\"btn btn-default btn-color\" data-role=\"end\">&nbsp;&nbsp;&nbsp;<i class=\"fa fa-fast-forward\"></i>&nbsp;&nbsp;&nbsp;</button>" +
        "</nav>" +
    "</div>",
    backdrop: true,
    onStart: function( tour )
    {
        localStorage.setItem( "tour_start", document.URL.split( "/" ).pop() );
        stayOnTourPage();
    },
    onEnd: function( tour )
    {
        var tourStart = localStorage.getItem( "tour_start" );
        localStorage.removeItem( "tour_start" );
        window.location.href = "./" + tourStart;
    }
});

if( !tour.ended() )
{
    togglePageTransitions( "pan-left-start", "pan-right-start", true ); //removes the start animation for the tour
    tour.init();
    tour.start();
}

$( document ).click( stayOnTourPage() );
$( window ).ready( stayOnTourPage() );

$( "#start-tour" ).click( function()
{
    tour.restart();
});

function stayOnTourPage()   //this function is used in the two handlers below to make sure that the only way the user can leave the tour page is to hit the end tour button
{
    if( !tour.ended() && !isFileInURL( "tour" ) )
    {
        window.location.href = "./tour.php";
    }
}
