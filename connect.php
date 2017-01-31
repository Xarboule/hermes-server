<?php

session_start();

error_reporting(E_ALL);

echo "<h2>Connexion TCP/IP</h2>\n";

/* Lit le port du service WWW. */
$service_port = 56987;

/* Lit l'adresse IP du serveur de destination */
$address = $_POST['ip'];
$_SESSION['ip'] = $address;

$in = "d 100";

$errno=0;
$errstr="";

$fp = pfsockopen($address, $service_port, $errno, $errstr);
if (!$fp) {
    echo "$errstr ($errno)<br/>\n";
    echo $fp;
} else {
    fwrite($fp, $in);
}

$_SESSION['socket'] = $fp;




/* Crée un socket TCP/IP. */
/*$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    echo "socket_create() a échoué : raison :  " . socket_strerror(socket_last_error()) . "\n";
    die();
} else {
    echo "OK.\n";
}

echo "Essai de connexion à '$address' sur le port '$service_port'...";
$result = socket_connect($socket, $address, $service_port);
if ($socket === false) {
    echo "socket_connect() a échoué : raison : ($result) " . socket_strerror(socket_last_error($socket)) . "\n";
    die();
} else {
    echo "OK.<br>";
}
$_SESSION['socket']=$socket;

$in="d 100";

echo "Envoi de la requête HTTP HEAD...";
socket_write($_SESSION['socket'], $in, 2048);
echo "OK.<br>";
*/

header('Location: remote.php');
?>