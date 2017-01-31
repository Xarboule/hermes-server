<?php
session_start();

/* Lit le port du service WWW. */
$service_port = 56987;

/* Lit l'adresse IP du serveur de destination */
$address = $_SESSION['ip'];

$errno=0;
$errstr="";

fclose($_SESSION['socket']);




 /*
if (isset($_SESSION['socket'])) {
    $in = "exit";

    echo "Envoi de la requête HTTP HEAD...";
    socket_write($_SESSION['socket'], $in, 2048);
    echo "OK.<br>";

    echo "Fermeture du socket...";
    socket_close($_SESSION['socket']);
    echo "OK.<br>";

} else {
    echo "Vous n'avez pas de socket actif.";
}
*/

header('Location: index.php');


?>