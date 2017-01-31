<!DOCTYPE html>
<html>
<body>

<p>Hermes<br></p>

<button  id="fbutton">Avant</button><br>
<button  id="lbutton">Gauche</button>
<button  onclick="stop()">Stop</button>
<button  id="rbutton">Droite</button><br>
<button  id="bbutton" >Arrière</button>



<p id="demo">Arrêt</p>

<script>
    function moveForward() {
        document.getElementById("demo").innerHTML = "Marche avant";
    }

    function moveBackward() {
        document.getElementById("demo").innerHTML = "Marche arrière";
    }

    function turnLeft() {
        document.getElementById("demo").innerHTML = "Tourne à gauche";
    }

    function turnRight() {
        document.getElementById("demo").innerHTML = "Tourne à droite";
    }

    function stop() {
        document.getElementById("demo").innerHTML = "Arrêt";
    }




    function keyDown(event) {

        if (event.keyCode === 38)
            moveForward();
        else if (event.keyCode === 40)
            moveBackward();
        else if (event.keyCode === 37)
            turnLeft();
        else if (event.keyCode === 39)
            turnRight();

    }

    function keyUp(event) {

        if (event.keyCode === 38)
            stop();
        else if (event.keyCode === 40)
            stop();
        else if (event.keyCode === 37)
            stop();
        else if (event.keyCode === 39)
            stop();
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