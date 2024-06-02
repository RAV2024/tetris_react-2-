
const figures = {
    O: [
        [1, 1],
        [1, 1],
    ],
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
};

const possibleLevels = {
    1: {
        scorePerLine: 10,
        speed: 400,
        nextLevelScore: 20,
    },
    2: {
        scorePerLine: 15,
        speed: 300,
        nextLevelScore: 500,
    },
    3: {
        scorePerLine: 20,
        speed: 200,
        nextLevelScore: 1000,
    },
    4: {
        scorePerLine: 30,
        speed: 100,
        nextLevelScore: 2000,
    },
    5: {
        scorePerLine: 50000000000,
        speed: 50,
        nextLevelScore: Infinity,
    },
};