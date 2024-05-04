let shapesProps = {
    path: 'content/images/shapes/',
    squareSize: 32
};
let effectTypesPath = 'content/images/effectTypes/';
let toLoad = shapes.length * 2 + 6;
let onImagesLoading = [];
function drawShape(context, cx, cy, index, variant, x, y, rotation, squareSize) {
    let angle = Math.PI / 2 * rotation;
    let dx = cx + squareSize / 2;
    let dy = cy + squareSize / 2;

    context.translate(dx, dy);
    context.rotate(angle);
    context.drawImage(
        shapes[index][variant].image,
        x * shapesProps.squareSize, y * shapesProps.squareSize,
        shapesProps.squareSize, shapesProps.squareSize,
        -squareSize / 2, -squareSize / 2,
        squareSize, squareSize);
    context.rotate(-angle);
    context.translate(-dx, -dy);
}

function loadShapes() {
    for (let i = 0; i < shapes.length; i++) {
        for (let v = 0; v < 2; v++) {
            let shape = shapes[i][v];
            shape.image = new Image();
            shape.image.src = `${shapesProps.path}${i}_${v}.png`;
            shape.image.onload = shape.image.onerror = () => {
                toLoad--;
                onImagesLoading.forEach(e => {
                    e(toLoad);
                });
            };
        }
    }

    for (let i = 0; i < 6; i++) {
        effectTypes[i] = new Image();
        effectTypes[i].src = `${effectTypesPath}${i}.png`;
        effectTypes[i].onload = effectTypes[i].onerror = () => {
            toLoad--;
            onImagesLoading.forEach(e => {
                e(toLoad);
            });
        };
    }
}
