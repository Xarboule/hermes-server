/**
 * Created by xarboule on 12/05/17.
 */






var canvas = new fabric.Canvas('map');

//canvas.removeListeners();
canvas.backgroundColor = 'white';



$.getJSON("/map/map.json", function(map){
   canvas.setHeight(map.map.y);
   canvas.setWidth(map.map.x);

    canvas.add(new fabric.Circle({
        originX: 'center',
        originY: 'center',
        left: map.map.xstart,
        top: map.map.ystart,
        fill: 'yellow',
        radius: 50,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockrotation: true,
        selectable: false
    }));

   for (var index in map.obstacles){
       var obstacle = map.obstacles[index];
       if(obstacle.type === "circle"){
            canvas.add(new fabric.Circle({
                originX: 'center',
                originY: 'center',
                left: obstacle.xcenter,
                top: obstacle.ycenter,
                fill: 'darkred',
                radius: obstacle.rayon,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockrotation: true,
                selectable: false
            }));
       }
       else if(obstacle.type === "rectangle"){
           canvas.add(new fabric.Rect({
               centeredRotation: true,
               originX: 'center',
               originY: 'center',
               left: obstacle.xcenter,
               top: obstacle.ycenter,
               fill: 'darkred',
               width: obstacle.width,
               height: obstacle.height,
               angle: (obstacle.angle/(2*Math.PI))*360,
               lockMovementX: true,
               lockMovementY: true,
               lockScalingX: true,
               lockScalingY: true,
               lockUniScaling: true,
               lockrotation: true,
               selectable: false
           }));
       }
       else {
           console.log("MAP : type d'obstacle inconnu : "+obstacle.type);
       }
   }

    /*canvas.add(new fabric.Triangle({
        originX: 'center',
        originY: 'center',
        left: map.map.xstart,
        top: map.map.ystart,
        angle: map.map.anglestart,
        fill: 'green'
    }));*/

    fabric.Image.fromURL('/img/robot.png', function(oImg){
        oImg.set({originX: 'center',
            originY: 'center',
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockrotation: true,
            selectable: false});
        oImg.set({'left': map.map.xstart});
        oImg.set({'top': map.map.ystart});
        oImg.set({'angle': map.map.anglestart/(2*Math.PI)*360});
        oImg.scale(0.05);
        canvas.add(oImg);

    });





    //------- Gestion setPoint ---------

    var setPoint = new fabric.Circle({
        originX: 'center',
        originY: 'center',
        left: map.map.xstart,
        top: map.map.ystart,
        fill: 'green',
        radius: 15
    });

    function moveHandler(){
        askGoTo(setPoint.getCenterPoint());
    }

    canvas.on('object:modified', moveHandler);


    canvas.add(setPoint);
    canvas.bringToFront(setPoint);
});


