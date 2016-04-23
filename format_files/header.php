<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <?php echo "<title>{$pageName}</title>"; ?>

        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/jquery.validationengine/2.6.4/css/validationEngine.jquery.css" rel"stylesheet">
        <link href="css/themes.css" rel="stylesheet">

        <?php echo "<link href=\"images/{$glyphiconName}.ico\" rel=\"shortcut icon\" type=\"image/x-icon\">\n"; ?>
    </head>

    <body class="subtle-pattern">

        <!--top navigation bar-->
        <?php include( "./format_files/start-row-10.php" ); ?>
        <div class="navbar">
            <div class="navbar-collapse">
                <ul class="nav navbar-nav">
                    <li<?php echo ( $pageName === "Home" ) ? " class=\"active\"" : ""; ?>>
                        <a href="index.php" title="Home"><span class="glyphicon glyphicon-home"></span></a>
                    </li>
                    <li<?php echo ( $pageName === "Portfolio" ) ? " class=\"active\"" : ""; ?>>
                        <a href="portfolio.php" title="Portfolio"><span class="glyphicon glyphicon-folder-open"></a>
                    </li>
                    <li<?php echo ( $pageName === "Contact Me" ) ? " class=\"active\"" : ""; ?>>
                        <a href="contact.php" title="Contact Me"><span class="glyphicon glyphicon-envelope"></a>
                    </li>
                </ul>
            </div>
        </div>
        <?php include( "./format_files/end-row-10.php" ); ?>

        <!--header-->
        <?php include( "./format_files/start-row-10.php" ); ?>
        <hr class="color-border">
            <h1 class="font-title font-header color">
                <div class="dropdown colored-link">
                    <!--the reason the whole anchor tag is on the same line is because it adds an extra space with underline if I don't, also the theme dropdown is sort of hidden/an easter egg-->
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="Change the Website Theme"><span class="glyphicon glyphicon-<?php echo "{$glyphiconName}";?>"></span></a>
                    <ul id="theme-menu" class="dropdown-menu">
                        <li><a href="#" id="picnic">Picnic</a></li>
                        <li><a href="#" id="billards-table">Billards Table</a></li>
                        <li><a href="#" id="pink-rice">Pink Rice</a></li>
                        <li><a href="#" id="old-map">Old Map</a></li>
                        <li><a href="#" id="stardust">Stardust</a></li>
                    </ul>
                    <?php echo ( $pageName === "Portfolio" ) ? "&nbsp;{$pageName}" : "{$pageName}";  //this is for formatting since the folder in Portfolio will cover part of the 'P' without a space ?>
                </div>
            </h1>
        <hr class="color-border">
        <?php include( "./format_files/end-row-10.php" ); ?>

        <!--start the main container which is closed in footer.php-->
        <?php include( "./format_files/start-row-10.php" ); ?>
        <div class="container-main" id="main-container">