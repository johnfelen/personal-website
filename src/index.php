<?php
    $pageName = "Home";
    $fontAwesome = "home";
    include( "./format_files/header.php" );
    include( "./format_files/start-row-10.php" );
?>

<div class="row">
    <div class="col-xs-3"></div>
        <div class="col-xs-6">
            <img src="../images/me.jpg" id="picture-of-me" alt="Picture of Me"/>
            <blink>
                <p class="font-main font-medium font-center color" id="broken"></p>
                <p class="font-ubuntu-mono font-medium font-center color" id="continue"> Click to Continue </p>
            </blink>
        </div>
    <div class="col-xs-3"></div>
</div>

<p class="font-ubuntu-mono font-medium font-center color" id="pokemon"></p>

<div class="row" id="names"></div>

<?php
    include( "./format_files/end-row-10.php" );
    include( "./format_files/footer.php" );
?>