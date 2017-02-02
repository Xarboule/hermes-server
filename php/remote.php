<!DOCTYPE html>
<html>
<body>

<p>Hermes<br></p>

<button  id="fbutton">Avant</button><br>
<button  id="lbutton">Gauche</button>
<button  onclick="stop()">Stop</button>
<button  id="rbutton">Droite</button><br>
<button  id="bbutton" >Arrière</button>
<br>
<br>
<br>
<button onclick="shutdown()">Fin du pilotage</button>



<p id="demo">Arrêt</p>

<script>
    function moveForward() {
        document.getElementById("demo").innerHTML = "Marche avant";
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'send.php');
        form.setAttribute('order', 'go');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    }

    function moveBackward() {
        document.getElementById("demo").innerHTML = "Marche arrière";
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'send.php');
        form.setAttribute('order', 'gor');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    }

    function turnLeft() {
        document.getElementById("demo").innerHTML = "Tourne à gauche";
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'send.php');
        form.setAttribute('order', 'sweepL');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    }

    function turnRight() {
        document.getElementById("demo").innerHTML = "Tourne à droite";
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'send.php');
        form.setAttribute('order', 'sweepR');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    }

    function stop() {
        document.getElementById("demo").innerHTML = "Arrêt";
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'send.php');
        form.setAttribute('order', 'stop');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    }

    function shutdown () {
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'disconnect.php');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    }

    function sweepStop () {
        var form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', 'send.php');
        form.setAttribute('order', 'sweepstop');
        form.style.display = 'hidden';
        document.body.appendChild(form);
        form.submit();
    }



    function keyDown(event) {

        if (event.keyCode === 38) // avant
            moveForward();
        else if (event.keyCode === 40) //arriere
            moveBackward();
        else if (event.keyCode === 37) //gauche
            turnLeft();
        else if (event.keyCode === 39) //droite
            turnRight();

    }

    function keyUp(event) {

        if (event.keyCode === 38)
            stop();
        else if (event.keyCode === 40)
            stop();
        else if (event.keyCode === 37)
            sweepStop();
        else if (event.keyCode === 39)
            sweepStop();
    }

    var fbutton = document.getElementById('fbutton');
    var bbutton = document.getElementById('bbutton');
    var rbutton = document.getElementById('rbutton');
    var lbutton = document.getElementById('lbutton');

    fbutton.addEventListener('mousedown', moveForward);
    bbutton.addEventListener('mousedown', moveBackward);
    rbutton.addEventListener('mousedown', turnRight);
    lbutton.addEventListener('mousedown', turnLeft);

    fbutton.addEventListener('mouseup', stop);
    bbutton.addEventListener('mouseup', stop);
    rbutton.addEventListener('mouseup', stop);
    lbutton.addEventListener('mouseup', stop);

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);




</script>

</body>
</html>