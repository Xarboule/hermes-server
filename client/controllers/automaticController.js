/**
 * Created by xarboule on 12/05/17.
 */

var canvas = new fabric.Canvas('map');

canvas.removeListeners();
canvas.backgroundColor = 'white';

$.getJSON("/map/map.json", function(map){
   canvas.setHeight(map.map.y);
   canvas.setWidth(map.map.x);




   for (var index in map.obstacles){
       var obstacle = map.obstacles[index];
       if(obstacle.type === "circle"){
            canvas.add(new fabric.Circle({
                originX: 'center',
                originY: 'center',
                left: obstacle.xcenter,
                top: obstacle.ycenter,
                fill: 'red',
                radius: obstacle.rayon
            }));
       }
       else if(obstacle.type === "rectangle"){
           canvas.add(new fabric.Rect({
               centeredRotation: true,
               originX: 'center',
               originY: 'center',
               left: obstacle.xcenter,
               top: obstacle.ycenter,
               fill: 'red',
               width: obstacle.width,
               height: obstacle.height,
               angle: (obstacle.angle/(2*Math.PI))*360
           }));
       }
       else {
           console.log("MAP : type d'obstacle inconnu : "+obstacle.type);
       }
   }

    canvas.add(new fabric.Triangle({
        originX: 'center',
        originY: 'center',
        left: map.map.xstart,
        top: map.map.ystart,
        angle: map.map.anglestart,
        fill: 'green'
    }));

});

