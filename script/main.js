const canvasContainer = document.getElementById("canvas-container");
const loading = document.getElementById("loading");
const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");            
const spacingVertical = 9;
const spacingHorizontal = 9;
const pointSize = 3;
let coordX = 0;
let coordY = canvas.height;

const calculateCanvasWidth = (dias) => {
    return (dias.length * spacingHorizontal);
}

const calculateCanvasHeight = (dias) => {
    let maxSizeVertical = dias[0]["obitosNovos"];
    for(dia of dias){
       if(dia["obitosNovos"] > maxSizeVertical){
         maxSizeVertical = dia["obitosNovos"];
       }
    }
    return (maxSizeVertical * spacingVertical);
}

const setPoint = (ctx, coordX, coordY, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(coordX, coordY, pointSize, pointSize, Math.PI, true);
    ctx.closePath();
    ctx.fill();
}

const clearCanvas = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const drawGraphic = (dias, coordX, coordY) => {
    let obitosPorDia = null;
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(dias[0]["_id"], coordX, coordY);
    for(dia of dias){
        coordX += spacingHorizontal;
        coordY = canvas.height;     
        obitosPorDia = dia["obitosNovos"];
        console.log(dia["_id"] + ": " + obitosPorDia);
        for(let obito = 0; obito < obitosPorDia; obito++){
            coordY -= spacingVertical;
            setPoint(ctx, coordX, coordY, ('#' + Math.random().toString(16).substr(2,6)));
        }
    }
    ctx.fillStyle = "black";
    ctx.fillText(dias[dias.length - 1]["_id"], (coordX + 10), canvas.height);
}

let dadosCovid = null;
const url = "https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalCasos";
const getData = () => {
    $.ajax({
        url : url,
        type : "get",
        beforeSend: () => {
            clearCanvas(ctx, canvas);
        }
    })
    .done((data) => {
        dadosCovid = data;
        canvas.width = calculateCanvasWidth(dadosCovid["dias"]) * 1.15;
        canvas.height = calculateCanvasHeight(dadosCovid["dias"]) + (spacingVertical * 5);
        coordY =  canvas.height;
        $(loading).fadeOut(500, function(){
            $(canvas).fadeIn(1500);
            $(canvasContainer).animate({
                scrollTop: canvas.height
            }, 1500);
        });                    
        drawGraphic(dadosCovid["dias"], coordX, coordY); 
    })
    .fail((jqXHR, textStatus, msg) => {
        console.log(msg);
    });
}
$(document).ready(function(){
    getData();               
});            

/* Gabriel Tessarini */