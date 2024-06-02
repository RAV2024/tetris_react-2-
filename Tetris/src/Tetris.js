const { useState, useEffect } = React;

function Tetris() {
    const [playfield, setPlayfield] = useState(Array.from({ length: 20 }, () => Array(10).fill(-2)));
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [activeTetro, setActiveTetro] = useState(getNewTetro());
    const [nextTetro, setNextTetro] = useState(getNewTetro());
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (!isPaused) {
            const timer = setInterval(() => {
                moveTetroDown();
            }, possibleLevels[level].speed);
            return () => clearInterval(timer);
        }
    }, [isPaused, level]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPaused) {
                if (e.keyCode === 37) {
                    moveTetro('left');
                } else if (e.keyCode === 39) {
                    moveTetro('right');
                } else if (e.keyCode === 40) {
                    moveTetroDown();
                } else if (e.keyCode === 38) {
                    rotateTetro();
                } else if (e.keyCode === 32) {
                    dropTetro();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [!isPaused]);

    const moveTetro = (direction) => {
        setActiveTetro((prevTetro) => {
            const newTetro = { ...prevTetro };
            if (direction === 'left') {
                newTetro.x -= 1;
            } else if (direction === 'right') {
                newTetro.x += 1;
            }
            if (hasCollisions(newTetro)) {
                return prevTetro;
            }
            return newTetro;
        });
    };

    const rotateTetro = () => {
        setActiveTetro((prevTetro) => {
            const newTetro = {
                ...prevTetro,
                shape: prevTetro.shape[0].map((val, index) =>
                    prevTetro.shape.map((row) => row[index]).reverse()
                ),
            };
            if (hasCollisions(newTetro)) {
                return prevTetro;
            }
            return newTetro;
        });
    };

    const dropTetro = () => {
        setActiveTetro((prevTetro) => {
            const newTetro = { ...prevTetro };
            while (!hasCollisions(newTetro)) {
                newTetro.y += 1;
            }
            newTetro.y -= 1;
            fixTetro(newTetro);
            return getNewTetro();
        });
    };

    const drawPlayfield = () => {
        const displayPlayfield = playfield.map((row, rowIndex) => row.slice());

        activeTetro.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell && displayPlayfield[activeTetro.y + y] && displayPlayfield[activeTetro.y + y][activeTetro.x + x] !== undefined) {
                    displayPlayfield[activeTetro.y + y][activeTetro.x + x] = 1;
                }
            });
        });

        return displayPlayfield.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
                <div
                    key={`${rowIndex}-${cellIndex}`}
                    className={`cell ${cell === 1 ? "movingCell" : cell === 2 ? "fixedCell" : ""}`} // То как отображается поле
                ></div>
            ))
        );
    };

    const drawNextTetro = () => {
        return (
            <div className="next-tetro-grid" style={{ gridTemplateColumns: `repeat(${nextTetro.shape[0].length}, 1fr)` }}>
                {nextTetro.shape.map((row, rowIndex) =>
                    row.map((cell, cellIndex) => (
                        <div
                            key={`${rowIndex}-${cellIndex}`}
                            className={`cell ${cell ? "movingCell" : ""}`}          
                        ></div>
                    ))
                )}
            </div>
        );
    };

    const moveTetroDown = () => {
        setActiveTetro((prevTetro) => {
            const newTetro = { ...prevTetro, y: prevTetro.y + 1 };          // Траектория игры
            if (hasCollisions(newTetro)) {
                fixTetro(prevTetro);
                return getNewTetro();
            }
            return newTetro;
        });
    };


    const handlePause = () => {
        setIsPaused((prevIsPaused) => !prevIsPaused);
    };


    const hasCollisions = (tetro) => {
        for (let y = 0; y < tetro.shape.length; y++) {
            for (let x = 0; x < tetro.shape[y].length; x++) {
                if (
                    tetro.shape[y][x] &&
                    (playfield[tetro.y + y] === undefined ||
                        playfield[tetro.y + y][tetro.x + x] === undefined ||
                        playfield[tetro.y + y][tetro.x + x] === 2)
                ) {
                    return true;
                }
            }
        }
        setTimeout(function() {
            handlePause()
            console.log("тест тайм сед");
        }, 20);
        handlePause()
        return false;
    };

    const fixTetro = (tetro) => {
        setPlayfield((prevPlayfield) => {
            const newPlayfield = prevPlayfield.map(row => row.slice());
            tetro.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell && newPlayfield[tetro.y + y] && newPlayfield[tetro.y + y][tetro.x + x] !== undefined) {
                        newPlayfield[tetro.y + y][tetro.x + x] = 2;
                    }
                });
            });
            return newPlayfield;
        });
        removeFullLines();

        setNextTetro((prevTetro) => {
            const newNextTetro = getNewTetro(); // Получаем новое значение следующей фигуры
            setActiveTetro(prevTetro); // Устанавливаем предыдущую NextTetro в активную фигуру
            return newNextTetro; // Устанавливаем новое значение в NextTetro
        });
        

        if (hasCollisions(nextTetro)) {
            resetGame();
        }
    };

    const removeFullLines = () => {
        setPlayfield((prevPlayfield) => {
            const newPlayfield = prevPlayfield.filter(row => !row.every(cell => cell === 2));
            const linesRemoved = 20 - newPlayfield.length;
            const scoreIncrement = possibleLevels[level].scorePerLine * linesRemoved;
            setScore(prevScore => prevScore + scoreIncrement);
            if (score + scoreIncrement >= possibleLevels[level].nextLevelScore) {
                setLevel(prevLevel => prevLevel + 1);
            }
            while (newPlayfield.length < 20) {
                newPlayfield.unshift(Array(10).fill(0));
            }
            return newPlayfield;
        });
    };

    const resetGame = () => {
        setPlayfield(Array.from({ length: 20 }, () => Array(10).fill(0)));
        setScore(0);
        setLevel(1);
        setActiveTetro(getNewTetro());
        setNextTetro(getNewTetro());
        setGameOver(true);
        setIsPaused(true)
    };

    const handleStart = () => {
        setIsPaused(false);
        setGameOver(false);
    };

    return (
        <div className="tetris">
            <div className="main">{drawPlayfield()}</div>
            <div className="gameControls">
                <button id="startButton" onClick={handleStart}>Start</button>
                <button id="pauseButton" onClick={handlePause}>{isPaused ? "Pause" : "Pause"}</button>
                <div className="score">Score: {score}</div>
                <div className="level">Level: {level}</div>
                <div id="next-tetro" className="next-tetro-container">{drawNextTetro()}</div>
                {gameOver && <div id="gameOverMessage" className="gameOverMessage1">
                    <div>Game Over</div>
                </div>}
            </div>
        </div>
    );
}

ReactDOM.render(<Tetris />, document.getElementById("root"));
