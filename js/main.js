const tablero = document.getElementById("tablero");
let textoPuntaje = document.getElementById("puntaje");
let serp = document.getElementById("snake");
const MAX_FILAS = 50;
const MAX_COLS = 50;
let DIR_X = 1;
let DIR_Y = 0;
let TIME = 250;
let GAMEOVER = false;
let puntaje = 0;
let juegoIniciado = true;
let IDintervalo;

let HTMLTablero = "";
tablero.innerHTML = "";
let snake = [];
let segmento = {
    x: 0,
    y: 0
}

let comida = {
    x: 0,
    y: 0
}

function crearComida(){
    do{
        comida.x = Math.floor((Math.random()*50));
        comida.y = Math.floor((Math.random()*50));
    }while (snake.some(segmento => (segmento.x === comida.x & segmento.y === comida.y)));
    pintarCelda(comida.x, comida.y, "red");
    localStorage.setItem('comida', JSON.stringify(comida));
}

function crearTablero(){
    for (let y=0; y < MAX_FILAS; y+=1){
        for (let x=0; x < MAX_COLS; x+=1){
            HTMLTablero += `<p class="celda" id="celda-${x}-${y}"></p>`;    
        }
    }
    tablero.innerHTML = HTMLTablero;
}

function crearSnake(){
    segmento.y = 25;
    for (let i = 25; i > 20; i-=1){
        let segmentoAux = {...segmento};
        segmentoAux.x = i;
        snake.push(segmentoAux);
    }
    localStorage.setItem('snake', JSON.stringify(snake));
}

function pintarCelda(x,y,color){
    const celda = document.getElementById(`celda-${x}-${y}`);
    celda.style.backgroundColor = color;
}
function limpiarCelda(x,y){
        const celda = document.getElementById(`celda-${x}-${y}`);
        celda.style.backgroundColor = "white";
}

function borrarSnake(){
    for (let segmento of snake){
        limpiarCelda(segmento.x, segmento.y);
    }
}

function cambiarDireccion (e){
    switch(e.code){
        case "ArrowUp":
            DIR_X = 0;
            DIR_Y = -1;
        break;
        case "ArrowDown":
            DIR_X = 0;
            DIR_Y = 1;
        break;
        case "ArrowLeft":
            DIR_X = -1;
            DIR_Y = 0;
        break;
        case "ArrowRight":
            DIR_X = 1;
            DIR_Y = 0;
        break;
    }
    localStorage.setItem('DIR_X', DIR_X);
    localStorage.setItem('DIR_Y', DIR_Y);
}

function comprobarPared(){
    if(snake[0].x == MAX_COLS || snake[0].y == MAX_FILAS || snake[0].x == -1 || snake[0].y == -1){
        localStorage.removeItem('snake');
        localStorage.removeItem('comida');
        localStorage.removeItem('puntaje');
        localStorage.removeItem('DIR_X');
        localStorage.removeItem('DIR_Y');
        localStorage.removeItem('juegoIniciado');
        juegoIniciado = false;
        GAMEOVER = true;
        alert("GAME OVER");
        return true;
    }
}

function avanzarSnake(){
    if (GAMEOVER === true)
        return;
    borrarSnake();
    let segmentoAux = {...snake[0]};
    snake.pop();
    segmentoAux.x += DIR_X;
    segmentoAux.y += DIR_Y;

    //compruebo autocolision
    if (snake.some(segmento => (segmento.x === segmentoAux.x & segmento.y === segmentoAux.y))){
        localStorage.removeItem('snake');
        localStorage.removeItem('comida');
        localStorage.removeItem('puntaje');
        localStorage.removeItem('DIR_X');
        localStorage.removeItem('DIR_Y');
        localStorage.removeItem('juegoIniciado');
        juegoIniciado = false;
        alert("GAME OVER");
        GAMEOVER = true;
        return;
    }
    snake.unshift(segmentoAux);
    if (comprobarPared())
        return;

    if(segmentoAux.x === comida.x && segmentoAux.y === comida.y){
        puntaje += 100;
        localStorage.setItem('puntaje', puntaje);
        textoPuntaje.innerHTML = `Puntaje: ${puntaje}`;
        crearComida();
        let segmentoAux1 = {...snake[snake.length-1]};
        let segmentoAux2 = {...snake[snake.length-2]};
        let segmentoDif = {...segmentoAux1};
        let segmentoNuevo = {...segmentoAux1};
        segmentoDif.x -= segmentoAux2.x;
        segmentoDif.y -= segmentoAux2.y;
        segmentoNuevo.x += segmentoDif.x;
        segmentoNuevo.y += segmentoDif.y;
        snake.push(segmentoNuevo);
        TIME -=5;
        clearInterval(IDintervalo);
        IDintervalo = window.setInterval(avanzarSnake,TIME);
    }
    localStorage.setItem('snake', JSON.stringify(snake));
    dibujarSnake();
}

function dibujarSnake(){
    for (let segmento of snake){
        pintarCelda(segmento.x, segmento.y, "black");
    }
}

crearTablero();

if (localStorage.getItem('juegoIniciado') || false){
    snake = JSON.parse(localStorage.getItem('snake'));
    puntaje = localStorage.getItem('puntaje');
    textoPuntaje.innerHTML = `Puntaje: ${puntaje}`;
    DIR_X = localStorage.getItem('DIR_X');
    DIR_Y = localStorage.getItem('DIR_Y');
    comida = JSON.parse(localStorage.getItem('comida'));
    pintarCelda(comida.x, comida.y, "red");
}else{
    juegoIniciado = true;
    localStorage.setItem('puntaje', puntaje);
    localStorage.setItem('juegoIniciado', juegoIniciado);
    crearSnake();
    crearComida();
}
dibujarSnake();

IDintervalo = window.setInterval(avanzarSnake,TIME);
window.addEventListener("keyup", cambiarDireccion)