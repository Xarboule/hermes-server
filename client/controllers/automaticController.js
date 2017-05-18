/**
 * Created by xarboule on 12/05/17.
 */

var canvas = document.getElementById("canvas");

var ctx = canvas.getContext('2d');

function drawCircle(x, y, r){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true); // Cercle exterieur
    //ctx.moveTo(110,75);
    ctx.stroke();
}

drawCircle(400, 100, 50);

