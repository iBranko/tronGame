var P = function() {
    this.object = null;
    this.canJump = false;
};

function handleKeyUpP1() {
    updateOrientation(moto1, 0)
}

function handleKeyRightP1() {
    updateOrientation(moto1, 1)
}

function handleKeyDownP1() {
    updateOrientation(moto1, 2)
}

function handleKeyLeftP1() {
    updateOrientation(moto1, 3)
}

function handleKeyUpP2() {
    updateOrientation(moto2, 0)
}

function handleKeyRightP2() {
    updateOrientation(moto2, 1)
}

function handleKeyDownP2() {
    updateOrientation(moto2, 2)
}

function handleKeyLeftP2() {
    updateOrientation(moto2, 3)
}

function handleKey(e){
    switch (e.keyCode) {
        case 87: handleKeyUpP1(); break;
        case 68: handleKeyRightP1(); break;
        case 83: handleKeyDownP1(); break;
        case 65: handleKeyLeftP1(); break;
        case 38: handleKeyUpP2(); break;
        case 39: handleKeyRightP2(); break;
        case 40: handleKeyDownP2(); break;
        case 37: handleKeyLeftP2(); break;
    }
    return false
}
