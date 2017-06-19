/**
 * Created by xarboule on 12/05/17.
 */






var canvas = new fabric.Canvas('map');

//canvas.removeListeners();
canvas.backgroundColor = 'white';

var pathgroup = new fabric.Group([]);

function displayPath(json){
    canvas.remove(pathgroup);
    pathgroup = new fabric.Group([]);
    for (var index in json.path){
        pathgroup.addWithUpdate(new fabric.Circle({
            originX: 'center',
            originY: 'center',
            left: json.path[index].x,
            top: json.path[index].y,
            fill: 'blue',
            radius: 2,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            lockrotation: true,
            selectable: false
        }));
    }
    canvas.add(pathgroup);
}

var oImg;

fabric.Image.fromURL('/img/robot.png', function(oIMG){
    oImg = oIMG;
    oImg.set({originX: 'center', // premier placement du robot, avant snmp
        originY: 'center',
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockrotation: true,
        selectable: false});
    oImg.set({'left': 100});
    oImg.set({'top': 100});
    oImg.set({'angle': 0/(2*Math.PI)*360});
    oImg.scale(0.05);
    canvas.add(oImg);
});

function updateRobotPosition(x, y, o){
    oImg.set({'left': x});
    oImg.set({'top': y});
    oImg.set({'angle': o/(2*Math.PI)*360});
}

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
        askGoTo(setPoint.getCenterPoint(), setPoint.getAngle()*(2*Math.PI)/360+(Math.PI/2));
    }

    canvas.on('object:modified', moveHandler);


    canvas.add(setPoint);
    canvas.bringToFront(setPoint);

    sendEvent("setpos "+map.map.xstart+" "+map.map.ystart);
    sendEvent("setang "+map.map.anglestart);
});


