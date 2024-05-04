/*
TYPES/EFFECTS:
Balanced      0
HP            1
Strength      2
Dexterity     3
Wisdom        4
Charisma      5
12 min max

CHARACTERISTICS:
Steadying        0
Warm             1
Endurance        2
Healing          3
Fragrant         4
Strengthening    5
Relaxing         6
Perception       7
Focus            8
Technique        9
5 min max

*/

let shapes = [
    {
        type: 1,
        characteristic: 0,
        0: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 1],
                [1, 0, 0],
            ],
            rotationShift: [
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: -1 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 0, 0],
                [1, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: -1 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: 1 },
            ]
        }
    },
    {
        type: 2,
        characteristic: 1,
        0: {
            size: {
                w: 2, h: 2
            },
            matrix: [
                [1, 1],
                [1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 0],
                [0, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        }
    },
    {
        type: 0,
        characteristic: 2,
        0: {
            size: {
                w: 1, h: 2
            },
            matrix: [
                [1, 1],
            ],
            rotationShift: [
                { x: 1, y: -1 },
                { x: 0, y: 1 },
                { x: 0, y: 0 },
                { x: -1, y: 0 },
            ]
        },
        1: {
            size: {
                w: 2, h: 2
            },
            matrix: [
                [1, 0],
                [0, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        }
    },
    {
        type: 3,
        characteristic: 2,
        0: {
            size: {
                w: 1, h: 4
            },
            matrix: [
                [1, 1, 1, 1],
            ],
            rotationShift: [
                { x: 2, y: -1 },
                { x: -2, y: 1 },
                { x: 2, y: -1 },
                { x: -2, y: 1 },
            ]
        },
        1: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 1],
                [1, 0, 0],
            ],
            rotationShift: [
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: -1 },
                { x: 0, y: 0 },
            ]
        }
    },
    {
        type: 4,
        characteristic: 3,
        0: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 0],
                [0, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [0, 1, 1],
                [1, 1, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        }
    },
    {
        type: 5,
        characteristic: 4,
        0: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 1],
                [0, 1, 0],
            ],
            rotationShift: [
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: -1 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 2, h: 2
            },
            matrix: [
                [1, 1],
                [1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
    },
    {
        type: 1,
        characteristic: 5,
        0: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 1],
                [1, 1, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: -1, y: 0 },
                { x: 1, y: -1 },
                { x: 0, y: 1 },
            ]
        },
        1: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 0],
                [1, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: -1, y: 0 },
                { x: 1, y: -1 },
                { x: 0, y: 1 },
            ]
        },
    },
    {
        type: 3,
        characteristic: 6,
        0: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 0, 1],
                [1, 1, 1],
                [1, 0, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
    },
    {
        type: 5,
        characteristic: 7,
        0: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 1, 0],
                [1, 1, 1],
                [1, 0, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
    },
    {
        type: 0,
        characteristic: 8,
        0: {
            size: {
                w: 2, h: 2
            },
            matrix: [
                [1, 1],
                [0, 1],
            ],
            rotationShift: [
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
                { x: 0, y: -1 },
            ]
        },
        1: {
            size: {
                w: 1, h: 2
            },
            matrix: [
                [1, 1],
            ],
            rotationShift: [
                { x: 1, y: -1 },
                { x: 0, y: 1 },
                { x: 0, y: 0 },
                { x: -1, y: 0 },
            ]
        },
    },
    {
        type: 2,
        characteristic: 1,
        0: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
    },
    {
        type: 4,
        characteristic: 9,
        0: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 2, h: 3
            },
            matrix: [
                [1, 1, 0],
                [1, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: -1, y: 0 },
                { x: 1, y: -1 },
                { x: 0, y: 1 },
            ]
        },
    },
    {
        type: 0,
        characteristic: 7,
        0: {
            size: {
                w: 1, h: 3
            },
            matrix: [
                [1, 1, 1],
            ],
            rotationShift: [
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
            ]
        },
        1: {
            size: {
                w: 2, h: 2
            },
            matrix: [
                [1, 1],
                [0, 1],
            ],
            rotationShift: [
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
                { x: 0, y: -1 },
            ]
        },
    },
    {
        type: 1,
        characteristic: 4,
        0: {
            size: {
                w: 4, h: 2
            },
            matrix: [
                [1, 0],
                [1, 1],
                [1, 1],
                [0, 1],
            ],
            rotationShift: [
                { x: -1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: -1 },
            ]
        },
        1: {
            size: {
                w: 4, h: 2
            },
            matrix: [
                [0, 1],
                [1, 1],
                [1, 1],
                [1, 0],
            ],
            rotationShift: [
                { x: -1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: -1 },
            ]
        },
    },
    {
        type: 2,
        characteristic: 0,
        0: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 1, 1],
                [0, 1, 1],
                [1, 1, 0],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
    },
    {
        type: 3,
        characteristic: 6,
        0: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 0, 1],
                [0, 1, 1],
                [1, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
    },
    {
        type: 4,
        characteristic: 9,
        0: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 1, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
        1: {
            size: {
                w: 3, h: 3
            },
            matrix: [
                [0, 1, 1],
                [1, 1, 1],
                [0, 0, 1],
            ],
            rotationShift: [
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
            ]
        },
    },
    {
        type: 5,
        characteristic: 4,
        0: {
            size: {
                w: 3, h: 4
            },
            matrix: [
                [0, 1, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 1, 0],
            ],
            rotationShift: [
                { x: 1, y: -1 },
                { x: 0, y: 1 },
                { x: 0, y: 0 },
                { x: -1, y: 0 },
            ]
        },
        1: {
            size: {
                w: 3, h: 4
            },
            matrix: [
                [0, 0, 1, 0],
                [1, 1, 1, 1],
                [0, 1, 0, 0],
            ],
            rotationShift: [
                { x: 1, y: -1 },
                { x: 0, y: 1 },
                { x: 0, y: 0 },
                { x: -1, y: 0 },
            ]
        },
    },
];
let effectTypes = [];
