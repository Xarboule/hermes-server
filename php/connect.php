<?php

session_start();

error_reporting(E_ALL);

echo "<h2>Connexion TCP/IP</h2>\n";

/* Lit le port du service WWW. */
$service_port = 56987;

/* Lit l'adresse IP du serveur de destination */
$address = $_POST['ip'];
$_SESSION['ip'] = $address;

$in = "sets 2000"; // vitesse max

$errno=0;
$errstr="";

$fp = pfsockopen($address, $service_port, $errno, $errstr);
if (!$fp) {
    echo "$errstr ($errno)<br/>\n";
    echo $fp;
    die();
}


header('Location: remote.php');
?>