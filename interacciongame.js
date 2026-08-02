//personaje 0
const movesElement = document.getElementById('moves');
//termino el personaje

//posicion inicial x
let x = 0;
let y = 0;

//que el personaje se pueda mover
movesElement.style.position = "absolute";
movesElement.style.left = x + "px";
movesElement.style.top = y + "px";

//mecanica del movimiento
function arriba() {
    y -= 10;
    movesElement.style.top = y + "px";
}

function abajo() {
    y += 10;
    movesElement.style.top = y + "px";
}

function izquierda() {
    x -= 10;
    movesElement.style.left = x + "px";
}

function derecha() {
    x += 10;
    movesElement.style.left = x + "px";
}

//encontrar las teclas del steclado
document.addEventListener("keydown", function(event)  {
    switch(event.key) {
        case "ArrowUp":
        arriba();
        break;
        
        case "ArrowDown":
            abajo();
            break;

        case "ArrowLeft":
            izquierda();
            break;

        case "ArrowRight":
             derecha();
             break;
    }
});