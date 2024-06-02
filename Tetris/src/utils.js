
function getNewTetro() {
    const possibleFigures = "IOLJTSZ";
    const rand = Math.floor(Math.random() * 7);
    const newTetro = figures[possibleFigures[rand]];

    return {
        x: Math.floor((10 - newTetro[0].length) / 2),
        y: 0,                                                                  
        shape: newTetro,
    };
}