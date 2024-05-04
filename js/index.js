const recordCookieName = 'record';
const shopCookieName = 'shop';
const pointsForClear = [4, 10, 30, 120];
const fieldSize = {
    w: 15, h: 25
}
const gamePadding = 40;
const speedUpMultiplier = 8;
const poisonTypes = ['balanced', 'hp', 'strength',
    'dexterity', 'wisdom', 'charisma'];
const poisonCharacterics = ['steadying', 'warm', 'endurance', 'healing', 'fragnant', 'strengthening', 'relaxing', 'perception', 'focus', 'technique'];
const typeLvlCount = 378;
const cancelHandler = e => {
    e.preventDefault();
    return false;
};

let game, canvas, ctx, lines, header, footer, pointsCount, loseOverlay,
    loseCount, loseBestCount, newBestCaption, loadingBar, tetrisDiagram,
    currentShapeData;

let points;
let squareSize = 0;
let field = [];
let currentShapeSnapshot = null;
let currentShape = {
    shape: 0,
    variant: 0,
    x: 5,
    y: 6,
    rotation: 3,
    rotate() {
        this.rotation = ++this.rotation % 4;
        this.x += this.getShape().rotationShift[this.rotation].x;
        this.y += this.getShape().rotationShift[this.rotation].y;
        if (isCurrentShapeOut() || isCurrentShapeIntersect()) {
            this.x -= this.getShape().rotationShift[this.rotation].x;
            this.y -= this.getShape().rotationShift[this.rotation].y;
            this.rotation--;
            if (this.rotation < 0) this.rotation = 3;
        } else {
            drawCurrentShape();
        }
    },
    changeVariant() {
        this.variant = ++this.variant % 2;
        if (isCurrentShapeOut() || isCurrentShapeIntersect()) {
            this.variant--;
            if (this.variant < 0) this.variant = 1;
        } else {
            drawCurrentShape();
        }
    },
    getShape() {
        return shapes[this.shape][this.variant];
    },
    getNaturalWidth() {
        return this.getShape().size.w;
    },
    getNaturalHeight() {
        return this.getShape().size.h;
    },
    getWidth() {
        return this.rotation == 1 || this.rotation == 3 ?
            this.getNaturalHeight() : this.getNaturalWidth();
    },
    getHeight() {
        return this.rotation == 1 || this.rotation == 3 ?
            this.getNaturalWidth() : this.getNaturalHeight();
    },
    moveLeft() {
        currentShape.x--;
        if (isCurrentShapeOut() || isCurrentShapeIntersect()) {
            currentShape.x++;
        } else {
            drawCurrentShape();
        }
    },
    moveRight() {
        currentShape.x++;
        if (isCurrentShapeOut() || isCurrentShapeIntersect()) {
            currentShape.x--;
        } else {
            drawCurrentShape();
        }
    }
};
let delay = 300;
let speedUp = false;
let playingTetrs = false;
let newRecord = false;
let windows;
let currentWindow = 0;
/*
standard      0
alchemy shop  1
*/
let tetrisMode = 0;
let shopState;
let currentSlot = -1;
let tetrisPoisonParams = {
    types: [],
    characteristics: []
};
let holdingLeft = false, holdingRight = false;
let moveLeftTimeout, moveRightTimeout;
let shop = {
    nextNeeded() {
        for (let i = 0; i < shopState.needed.length; i++) {
            this.nextNeededI(i);
        }
    },
    nextNeededI(i) {
        let types = [];
        types.push(rndInt(1, 6));
        let characteristics = [];
        characteristics.push(rndInt(0, 10));
        // yeah, now the best method. But here we have only
        // one element, so i think it is faster here
        if (rndInt(0, 2)) {
            let n;
            do {
                n = rndInt(1, 6);
            } while (n == types[0]);
            types.push(n);
        } else {
            let n;
            do {
                n = rndInt(0, 10);
            } while (n == characteristics[0]);
            characteristics.push(n);
        }
        shopState.needed[i] = {
            types: types,
            characteristics: characteristics
        };
    },
    addNeeded() {
        shopState.needed.push(null);
        nextNeededI(shopState.needed.length - 1);
    },
    renderShowcase() {
        let list = document.querySelector('.shop__poisons-list_showcase');
        list.innerHTML = "";
        for (let i = 0; i < shopState.sellingPoisons.length; i++) {
            const id = shopState.sellingPoisons[i];
            this.renderShowcasePoison(list, id, i);
        }
    },
    htmlRemoveShowcasePoison(parent, i) {
        let el = parent.querySelector(`.poison.i_${i}`);
        if (el != null) el.remove();
    },
    renderShowcasePoison(parent, id, i) {
        this.htmlRemoveShowcasePoison(parent, i);
        let poisonCard;
        if (id != -1 && id != null) {
            const poison = shopState.poisons.get(id);
            poisonCard = document.querySelector('#showcase-poison')
                .content.firstElementChild.cloneNode(true);
            const imgs = poisonCard.querySelector('.poison__type-imgs');
            const typeList = poisonCard.querySelector('.poison__types-list');
            const characteristicList = poisonCard.querySelector('.poison__characteristics-list');

            poisonCard.classList.add(`poison_${poison.lvl + 2}`);
            poisonCard.classList.add(`id_${id}`);
            poisonCard.querySelector('.poison__lvl-index').innerText = poison.lvl;
            poisonCard.querySelector('.poison__amount').innerText = poison.cost;

            for (let type of poison.types) {
                const li = document.createElement('li');
                li.classList.add('poison__type');
                li.innerText = poisonTypes[type];
                typeList.appendChild(li);

                const img = document.createElement('img');
                img.classList.add('poison__type-img');
                img.src = `content/images/effectTypes/${type}.png`;
                imgs.appendChild(img);
            }
            for (let c of poison.characteristics) {
                const li = document.createElement('li');
                li.classList.add('poison__characteristic');
                li.innerText = poisonCharacterics[c];
                characteristicList.appendChild(li);
            }
            // events
            poisonCard.querySelector('.poison__remove')
                .addEventListener('click', () => {
                    shopState.sellingPoisons[i] = -1;
                    this.saveShopState();
                    this.renderShowcasePoison(parent, -1, i);
                    this.renderPoison(
                        document.querySelector('.shop__poisons-list_inventory'),
                        id
                    );
                });
            poisonCard.querySelector('.poison__delete')
                .addEventListener('click', () => {
                    shopState.sellingPoisons[i] = -1;
                    shopState.poisons.delete(id);
                    shop.htmlRemovePoison(document.querySelector('.shop__poisons-list_inventory'), id);
                    this.saveShopState();
                    this.renderShowcasePoison(parent, -1, i);
                });
        } else {
            poisonCard = document.querySelector('#showcase-placeholder')
                .content.firstElementChild.cloneNode(true);
            poisonCard.addEventListener('click', () => {
                currentSlot = i;
                this.openPoisonsList();
            });
        }
        poisonCard.classList.add(`i_${i}`);
        parent.insertBefore(poisonCard,
            parent.querySelector(`.poison.i_${i + 1}`));
    },
    saveShopState() {
        setCookie(shopCookieName, JSON.stringify(shopState, jsonReplacer));
    },
    loadShopState() {
        const shopCookie = getCookie(shopCookieName);
        if (shopCookie != null) {
            shopState = JSON.parse(shopCookie, jsonReviver);
            if (shopState.today.cooked === false) {
                shopState.today.cooked = 0;
            } else if (shopState.today.cooked === true) {
                shopState.today.cooked = 1;
            }
            if (!Object.hasOwn(shopState, 'maxTypesCount')) {
                shopState.maxTypesCount = 1;
            }
            if (!Object.hasOwn(shopState, 'maxCharacteristicsCount')) {
                shopState.maxCharacteristicsCount = 1;
            }
        }
        else {
            shopState = {
                money: 0,
                poisons: new Map(),
                sellingPoisons: [-1],
                needed: [null, null],
                today: {
                    i: 0,
                    cooked: 1,
                    toNextNeeded: 2
                },
                maxTypesCount: 1,
                maxCharacteristicsCount: 1
            };
            this.nextNeeded();
            this.saveShopState();
        }
    },
    renderPoisonList() {
        let list = document.querySelector('.shop__poisons-list_inventory');
        list.innerHTML = "";
        for (let [id, poison] of shopState.poisons) {
            if (!shopState.sellingPoisons.includes(id))
                this.renderPoison(list, id);
        }
    },
    htmlRemovePoison(parent, id) {
        let obj = parent.querySelector(`.poison_inventory.id_${id}`);
        if (obj != null)
            obj.remove();
    },
    renderPoison(parent, id) {
        this.htmlRemovePoison(parent, id);
        let poisonCard;
        const poison = shopState.poisons.get(id);
        poisonCard = document.querySelector('#inventory-poison')
            .content.firstElementChild.cloneNode(true);
        const imgs = poisonCard.querySelector('.poison__type-imgs');
        const typeList = poisonCard.querySelector('.poison__types-list');
        const characteristicList = poisonCard.querySelector('.poison__characteristics-list');

        poisonCard.classList.add(`poison_${poison.lvl + 2}`);
        poisonCard.classList.add(`id_${id}`);
        poisonCard.querySelector('.poison__lvl-index').innerText = poison.lvl;
        poisonCard.querySelector('.poison__amount').innerText = poison.cost;

        for (let type of poison.types) {
            const li = document.createElement('li');
            li.classList.add('poison__type');
            li.innerText = poisonTypes[type];
            typeList.appendChild(li);

            const img = document.createElement('img');
            img.classList.add('poison__type-img');
            img.src = `content/images/effectTypes/${type}.png`;
            imgs.appendChild(img);
        }
        for (let c of poison.characteristics) {
            const li = document.createElement('li');
            li.classList.add('poison__characteristic');
            li.innerText = poisonCharacterics[c];
            characteristicList.appendChild(li);
        }
        // events
        poisonCard.querySelector('.poison__delete')
            .addEventListener('click', () => {
                this.htmlRemovePoison(parent, id);
                shopState.poisons.delete(id);
                this.saveShopState();
            });
        poisonCard.addEventListener('click', () => {
            if (shopState.poisons.get(id) == null) return;
            this.closePoisonList();
            shopState.sellingPoisons[currentSlot] = id;
            this.saveShopState();
            this.htmlRemovePoison(parent, id);
            this.renderShowcasePoison(document.querySelector('.shop__poisons-list_showcase'), id, currentSlot);
        });

        parent.appendChild(poisonCard);
    },
    openPoisonsList() {
        document.querySelector('.inventory').classList.add('inventory_open');
    },
    closePoisonList() {
        document.querySelector('.inventory').classList.remove('inventory_open');
    },
};
window.onload = () => {
    game = document.querySelector('.game');
    canvas = document.querySelector('.game__canvas');
    lines = document.querySelector('.game__canvas-lines');
    ctx = canvas.getContext('2d');
    header = document.querySelector('.header');
    footer = document.querySelector('.footer');
    pointsCount = document.querySelector('.points__count');
    loseOverlay = document.querySelector('.lose-overlay')
    loseCount = document.querySelector('.lose-overlay__count');
    loseBestCount = document.querySelector('.lose-overlay__best-count');
    newBestCaption = document.querySelector('.lose-overlay__new-best');
    windows = document.getElementsByClassName('window');
    loadingBar = document.querySelector('.loading__bar');
    tetrisDiagram = document.querySelector('.diagram__canvas');
    currentShapeData = document.querySelector('.currentShapeData');

    document.querySelector('.lose-overlay__retry')
        .addEventListener('click', () => {
            resetTetris();
            playingTetrs = true;
        });
    document.querySelector('.lose-overlay__home')
        .addEventListener('click', () => {
            setActiveWindow(0);
        });
    document.querySelector('.inventory__close').addEventListener('click', () => {
        shop.closePoisonList();
    });
    for (let i = 0; i < windows.length; i++)
        if (windows[i].classList.contains('window_active'))
            currentWindow = i;
    let modes = document.getElementsByClassName('play__mode');
    modes[0].addEventListener('click', () => {
        tetrisMode = 0;
        resetTetris();
        setActiveWindow(1);
        playingTetrs = true;
    });
    modes[1].addEventListener('click', () => {
        tetrisMode = 1;
        shop.loadShopState();
        shop.renderShowcase();
        shop.renderPoisonList();
        setActiveWindow(2);
    });
    onImagesLoading.push((i) => {
        if (i == 0) {
            setActiveWindow(0);
            resetTetris();
        }
        if (i == shapes.length - 1) {
            loadingBar.classList.remove('bar_animated');
        }
        loadingBar.querySelector('.bar__filler').style.width =
            `${100 - (100 / shapes.length * i)}%`;
    });
    loadShapes();
    resize();
    window.addEventListener('resize', resize);
    tetrisTimer();
    shapeMoveTimer();
    window.addEventListener('keydown', e => {
        if (playingTetrs) {
            switch (e.key) {
                case 'ArrowUp':
                    currentShape.rotate();
                    break;
                case 'ArrowLeft':
                    currentShape.moveLeft();
                    break;
                case 'ArrowRight':
                    currentShape.moveRight();
                    break;
                case 'ArrowDown':
                    if (!speedUp) {
                        delay /= speedUpMultiplier;
                        speedUp = true;
                    }
                    break;
                case ' ':
                    currentShape.changeVariant();
                    break;
            }
        }
    });
    window.addEventListener('keyup', e => {
        if (playingTetrs) {
            switch (e.key) {
                case 'ArrowDown':
                    if (speedUp) {
                        delay *= speedUpMultiplier;
                        speedUp = false;
                    }
                    break;
            }
        }
    });
    document.querySelector('.controls__rotate').addEventListener('touchstart', () => {
        if (playingTetrs) {
            currentShape.rotate();
        }
    });
    document.querySelector('.controls__variant').addEventListener('touchstart', () => {
        if (playingTetrs) {
            currentShape.changeVariant();
        }
    });
    document.querySelector('.controls__down').addEventListener('touchstart', () => {
        if (playingTetrs) {
            if (!speedUp) {
                delay /= speedUpMultiplier;
                speedUp = true;
            }
        }
    });
    document.querySelector('.controls__down').addEventListener('touchend', () => {
        if (playingTetrs) {
            if (speedUp) {
                delay *= speedUpMultiplier;
                speedUp = false;
            }
        }
    });

    document.querySelector('.controls__left').addEventListener('touchstart', () => {
        currentShape.moveLeft();
        moveLeftTimeout = setTimeout(() => {
            holdingLeft = true;
        }, 200);
    });
    document.querySelector('.controls__left').addEventListener('touchend', () => {
        clearTimeout(moveLeftTimeout);
        holdingLeft = false;
    });

    document.querySelector('.controls__right').addEventListener('touchstart', () => {
        currentShape.moveRight();
        moveRightTimeout = setTimeout(() => {
            holdingRight = true;
        }, 200);
    });
    document.querySelector('.controls__right').addEventListener('touchend', () => {
        clearTimeout(moveRightTimeout);
        holdingRight = false;
    });



    document.querySelector('.controls__right')
        .addEventListener('contextmenu', cancelHandler);
    document.querySelector('.controls__left')
        .addEventListener('contextmenu', cancelHandler);
    document.querySelector('.controls__down')
        .addEventListener('contextmenu', cancelHandler);
    document.querySelector('.controls__variant')
        .addEventListener('contextmenu', cancelHandler);
    document.querySelector('.controls__rotate')
        .addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });

    drawLines();
    document.querySelector('.shop__cook').addEventListener('click', () => {
        resetTetris();
        playingTetrs = true;
        setActiveWindow(1);
    });
};

function setActiveWindow(i) {
    windows[currentWindow].classList.remove('window_active');
    currentWindow = i;
    windows[currentWindow].classList.add('window_active');

    let header = document.querySelector('.header');
    let footer = document.querySelector('.footer');
    if (i == 0) {
        if (header.classList.contains('hidden'))
            header.classList.remove('hidden');
        if (footer.classList.contains('hidden'))
            footer.classList.remove('hidden');
    } else {
        if (!header.classList.contains('hidden'))
            header.classList.add('hidden');
        if (!footer.classList.contains('hidden'))
            footer.classList.add('hidden');
    }
}

function drawLines() {
    let ctx = lines.getContext('2d');
    ctx.clearRect(0, 0, lines.width, lines.height);
    ctx.strokeStyle = '#9e813d20';
    for (let i = 1; i < fieldSize.w; i++) {
        ctx.beginPath();
        ctx.moveTo(i * squareSize, 0);
        ctx.lineTo(i * squareSize, lines.height);
        ctx.stroke();
    }
    for (let i = 1; i < fieldSize.h; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * squareSize);
        ctx.lineTo(lines.width, i * squareSize);
        ctx.stroke();
    }
}

function clearField() {
    for (let i = 0; i < fieldSize.w; i++) {
        field[i] = [];
        for (let j = 0; j < fieldSize.h; j++) {
            field[i][j] = {
                shape: -1,
                variant: 0,
                rotation: 0,
                x: 0,
                y: 0
            };
        }
    }
}

function resetTetris() {
    clearField();
    points = 0;
    updatePoints();
    if (speedUp) {
        speedUp = false;
        delay *= speedUpMultiplier;
    }
    drawField();
    drawLines();
    nextShape();
    if (!loseOverlay.classList.contains('overlays__overlay_hidden'))
        loseOverlay.classList.add('overlays__overlay_hidden');

    tetrisPoisonParams = {};
    tetrisPoisonParams.types = [];
    tetrisPoisonParams.characteristics = [];
    for (let i = 0; i < 11; i++) {
        tetrisPoisonParams.characteristics.push(0);
        if (i < 6) tetrisPoisonParams.types.push(0);
    }
    tetrisPoisonParams.types[0] = 7;
    renderTetrisDiagram();


    if (tetrisMode == 1) {
        if (currentShapeData.classList.contains('hidden'))
            currentShapeData.classList.remove('hidden');
    } else if (!currentShapeData.classList.contains('hidden'))
        currentShapeData.classList.add('hidden');
}

function isCurrentShapeOut() {
    return currentShape.x < 0 || currentShape.y < 0 ||
        currentShape.x + currentShape.getWidth() > fieldSize.w ||
        currentShape.y + currentShape.getHeight() > fieldSize.h;
}

function isCurrentShapeIntersect() {
    let w = currentShape.getNaturalWidth();
    let h = currentShape.getNaturalHeight();
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if (currentShape.getShape().matrix[x][y]) {
                let c = { x: x, y: y };

                moveCordsRot(c, currentShape.rotation, w, h);
                let fc = field[currentShape.x + c.x][currentShape.y + c.y];
                if (fc.shape != -1) return true;
            }
        }
    }
    return false;
}

function tetrisTimer() {
    setTimeout(tetrisTimer, delay);
    if (playingTetrs) moveCurrentShape();
}

function shapeMoveTimer() {
    setTimeout(shapeMoveTimer, 100);
    if (playingTetrs) {
        if (holdingLeft) {
            currentShape.moveLeft();
        }
        if (holdingRight) {
            currentShape.moveRight();
        }
    }
}

function moveCurrentShape() {
    currentShape.y++;
    if (isCurrentShapeOut() || isCurrentShapeIntersect()) {
        currentShape.y--;
        placeCurrentShape();
        findFullLines();
        nextShape();
        drawField();
    }
    drawCurrentShape();
}

function placeCurrentShape() {
    let w = currentShape.getNaturalWidth();
    let h = currentShape.getNaturalHeight();
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if (currentShape.getShape().matrix[x][y]) {
                let c = { x: x, y: y };

                moveCordsRot(c, currentShape.rotation, w, h);
                let fc = field[currentShape.x + c.x][currentShape.y + c.y];
                fc.shape = currentShape.shape;
                fc.variant = currentShape.variant;
                fc.rotation = currentShape.rotation;
                fc.x = x;
                fc.y = y;
            }
        }
    }
}

function findFullLines() {
    let removed = 0;
    for (let y = 0; y < fieldSize.h - removed; y++) {
        if (isFieldLineFull(y)) {
            for (let x = 0; x < fieldSize.w; x++) {
                let type = shapes[field[x][y].shape].type;
                let add = type == 0 ? 1 : 7;
                tetrisPoisonParams.types[type] += add;
                tetrisPoisonParams.characteristics[shapes[field[x][y].shape].characteristic]++;
                field[x].splice(y, 1);
            }
            y--;
            removed++;
        }
    }
    for (let i = 0; i < removed; i++) {
        for (let x = 0; x < fieldSize.w; x++) {
            field[x].unshift({
                shape: -1,
                variant: 0,
                rotation: 0,
                x: 0,
                y: 0
            });
        }
    }

    if (tetrisMode == 0) {
        if (removed > 0 && removed < 5) {
            points += pointsForClear[removed - 1];
            updatePoints();
        }
    } else {
        let add = Math.max(removed - 1, 0);
        tetrisPoisonParams.types[0] += Math.pow(add, 2);
        if (removed > 0) {
            renderTetrisDiagram();
        }
    }
}

function renderTetrisDiagram() {
    let ctx = tetrisDiagram.getContext('2d');
    let s = tetrisDiagram.height = tetrisDiagram.width =
        tetrisDiagram.getBoundingClientRect().width;

    ctx.clearRect(0, 0, s, s);

    if (tetrisMode != 1) return;

    const currPoison = getCurrentTPotion();

    ctx.fillStyle = '#d6d6d677';
    ctx.strokeStyle = '#aaaaaaCC';

    ctx.beginPath();
    let p = getPentagonPoint(0, 4, s);
    ctx.moveTo(p.x, p.y);
    for (let t = 1; t < 6; t++) {
        p = getPentagonPoint(t, 4, s);
        ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 2;
    for (let l = 1; l < 5; l++) {
        ctx.beginPath();
        let p = getPentagonPoint(0, l, s);
        ctx.moveTo(p.x, p.y);
        for (let t = 1; t < 6; t++) {
            p = getPentagonPoint(t, l, s);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }

    ctx.fillStyle = '#d6c08b88';
    for (let t = 1; t < 6; t++) {
        p = getPentagonPoint(t, 5.3, s);
        let size = Math.min(40, s / 10);
        if (currPoison.types.includes(t)) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, size / 2 + 5, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.drawImage(effectTypes[t], p.x - size / 2, p.y - size / 2, size, size);
    }

    ctx.beginPath();
    p = getPentagonPoint(1, (tetrisPoisonParams.types[0] +
        tetrisPoisonParams.types[1]) / typeLvlCount, s);
    ctx.moveTo(p.x, p.y);
    for (let t = 2; t < 6; t++) {
        p = getPentagonPoint(t, (tetrisPoisonParams.types[0] +
            tetrisPoisonParams.types[t]) / typeLvlCount, s);
        ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();

    const characteristicsList = document.querySelector('.poison-info__characteristics-list');
    characteristicsList.innerHTML = "";
    currPoison.characteristics.forEach(e => {
        const li = document.createElement('li');
        li.classList.add('poison-info__characteristic');
        li.innerText = poisonCharacterics[e];
        characteristicsList.appendChild(li);
    });
}

/*
level -> 0>= .. <=3 <4
type ->  1>= .. <=5 <6
*/
function getPentagonPoint(type, level, size) {
    let s = size * 0.5 / 8 * (level + 0.5);
    return {
        x: Math.cos(Math.PI * 2 / 5 * type + Math.PI / 2) * s + size / 2,
        y: Math.sin(Math.PI * 2 / 5 * type + Math.PI / 2) * s + size / 2,
    }
}

function updatePoints() {
    pointsCount.innerText = points;
    if (points > getTetrisRecord()) {
        setTetrisRecord(points);
        newRecord = true;
    }
}

function isFieldLineFull(y) {
    for (let x = 0; x < fieldSize.w; x++)
        if (field[x][y].shape == -1) return false;
    return true;
}

function nextShape() {
    currentShape.x = Math.round(fieldSize.w / 2) - 2;
    currentShape.y = 0;
    currentShape.rotation = 0;

    currentShape.shape = rndInt(0, shapes.length);
    currentShape.variant = 0;
    currentShapeSnapshot = null;

    setCurrentShapeData();

    if (isCurrentShapeIntersect()) lose();
}

function setCurrentShapeData() {
    document.querySelector('.currentShapeData__type').src =
        `${effectTypesPath}${shapes[currentShape.shape].type}.png`;
    document.querySelector('.currentShapeData__characteristic').innerText =
        poisonCharacterics[shapes[currentShape.shape].characteristic];
}

function lose() {
    playingTetrs = false;
    if (tetrisMode == 0) {
        let bestCount = getTetrisRecord();
        if (newRecord) {
            if (newBestCaption.classList.contains('hidden'))
                newBestCaption.classList.remove('hidden');
        } else {
            if (!newBestCaption.classList.contains('hidden'))
                newBestCaption.classList.add('hidden');
        }
        loseCount.innerText = points;
        loseBestCount.innerText = bestCount;
        loseOverlay.classList.remove('overlays__overlay_hidden');
    } else {
        const currPoison = getCurrentTPotion();
        if (currPoison.types.length > 0) {
            const l = [...shopState.poisons]
            shopState.poisons.set(
                l.length > 0 ? l[l.length - 1][0] + 1 : 0,
                currPoison
            );
            shop.saveShopState();
            shop.renderPoisonList();
        }
        setActiveWindow(2);
    }
}

const typeCompareFunction = (a, b) => b.c - a.c;
function getCurrentTPotion() {
    let types = [];
    let characteristics = [];
    for (let i = 1; i < 6; i++) {
        types[i - 1] = {
            i: i,
            c: tetrisPoisonParams.types[i] + tetrisPoisonParams.types[0]
        };
    }
    for (let i = 0; i < 10; i++) {
        characteristics[i] = {
            i: i,
            c: tetrisPoisonParams.characteristics[i]
        };
    }
    types = types.sort(typeCompareFunction)
        .filter(e => Math.floor(e.c / typeLvlCount) - 1 >= 0);
    characteristics = characteristics.sort(typeCompareFunction)
        .filter(e => e.c > 0);
    let poisonTypes = [];
    let maxC = 0;
    if (types.length > 0) {
        maxC = types[0].c
        while (types.length > 0 &&
            poisonTypes.length < shopState.maxTypesCount &&
            types[0].c == maxC) {
            poisonTypes.push(types[0].i);
            types.shift();
        }
    }
    let poisonCharacterics = [];
    if (characteristics.length > 0) {
        while (characteristics.length > 0 &&
            poisonCharacterics.length < shopState.maxCharacteristicsCount) {
            poisonCharacterics.push(characteristics[0].i);
            characteristics.shift();
        }
    }


    let cost = 0;
    types.forEach(e => cost += e.c * 20);
    characteristics.forEach(e => cost += e.c * 0.7);

    return {
        types: poisonTypes,
        characteristics: poisonCharacterics,
        cost: Math.round(cost),
        lvl: Math.floor(maxC / typeLvlCount) - 1
    };
}

function resize() {
    let squareSizeByWidth = Math.min(shapesProps.squareSize,
        (window.innerWidth - gamePadding) / fieldSize.w);
    let heightPadding = gamePadding + (window.innerWidth > 420 ? 260 : 220);
    let squareSizeByHeight = Math.min(shapesProps.squareSize,
        (window.innerHeight - heightPadding) / fieldSize.h);
    if (squareSizeByHeight * fieldSize.w > window.innerWidth - gamePadding) {
        squareSize = squareSizeByWidth;
    } else {
        squareSize = squareSizeByHeight;
    }
    game.style.width = squareSize * fieldSize.w + 'px';
    game.style.height = squareSize * fieldSize.h + 'px';
    canvas.width = squareSize * fieldSize.w;
    canvas.height = squareSize * fieldSize.h;
    lines.width = squareSize * fieldSize.w;
    lines.height = squareSize * fieldSize.h;
    if (playingTetrs) {
        drawLines();
        drawField();
        renderTetrisDiagram();
    }
}

function moveCordsRot(c, rotation, naturalW, naturalH) {
    if (rotation == 1 || rotation == 2) {
        c.y = naturalH - c.y - 1;
    }
    if (rotation >= 2) {
        c.x = naturalW - c.x - 1;
    }

    if (rotation == 1 || rotation == 3) {
        let t = c.x;
        c.x = c.y;
        c.y = t;
    }
}

function drawCurrentShape() {
    if (currentShapeSnapshot != null) {
        ctx.clearRect(
            currentShapeSnapshot.x * squareSize,
            currentShapeSnapshot.y * squareSize,
            currentShapeSnapshot.w * squareSize,
            currentShapeSnapshot.h * squareSize);
        for (let i = currentShapeSnapshot.x; i <
            currentShapeSnapshot.x + currentShapeSnapshot.w; i++) {
            for (let j = currentShapeSnapshot.y; j <
                currentShapeSnapshot.y + currentShapeSnapshot.h; j++) {
                drawFieldSquare(i, j);
            }
        }
    }
    let shape = currentShape.getShape();
    let w = shape.size.w;
    let h = shape.size.h;
    for (let sx = 0; sx < w; sx++) {
        for (let sy = 0; sy < h; sy++) {
            let c = { x: sx, y: sy };
            moveCordsRot(c, currentShape.rotation, w, h);
            let cx = (currentShape.x + c.x) * squareSize;
            let cy = (currentShape.y + c.y) * squareSize;

            if (shape.matrix[sx][sy]) {
                drawShape(ctx, cx, cy,
                    currentShape.shape, currentShape.variant, sx, sy,
                    currentShape.rotation, squareSize);
            } else {
                drawFieldSquare(currentShape.x + c.x, currentShape.y + c.y);
            }
        }
    }
    currentShapeSnapshot = {
        x: currentShape.x,
        y: currentShape.y,
        w: currentShape.getWidth(),
        h: currentShape.getHeight()
    };
}

function drawField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < fieldSize.w; i++) {
        for (let j = 0; j < fieldSize.h; j++) {
            drawFieldSquare(i, j);
        }
    }
}

function drawFieldSquare(x, y) {
    let point = field[x][y];

    if (point.shape === -1) return;
    drawShape(ctx, x * squareSize, y * squareSize, point.shape,
        point.variant, point.x, point.y, point.rotation, squareSize);
}

const getTetrisRecord = () =>
    parseInt(getCookie(recordCookieName) | '0');

const setTetrisRecord = (points) => setCookie(recordCookieName, points);

