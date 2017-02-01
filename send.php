<?php
/**
 * Created by PhpStorm.
 * User: xarboule
 * Date: 31/01/17
 * Time: 18:00
 */

session_start();

$errno=0;
$errstr="";
$service_port = 56987;


$fp = pfsockopen($_SESSION['ip'], $service_port, $errno, $errstr);
if (!$fp) {
    echo "$errstr ($errno)<br/>\n";
    echo $fp;
} else {

    fwrite($fp, $_POST['order'], 2048);
    echo("Socket OK<br>");
}



?>