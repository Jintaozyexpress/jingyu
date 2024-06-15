const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d', { willReadFrequently: true });
const inpColor = document.querySelector('input[type="color"]');
const inpFile = document.querySelector('input[type="file"]');

function loadImage(src) {
    const img = new Image();
    img.onload = function () {
        cvs.width = img.width;
        cvs.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
    img.src = src;
}

function init() {
    loadImage('a.jpg'); // 默认加载服务器上的图片
}
init();

cvs.addEventListener('click', function (e) {
    const clickX = e.offsetX,
          clickY = e.offsetY;
    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const centerColor = getColor(clickX, clickY, imgData);
    const targetColor = hex2rgba(inpColor.value);
    changeColor(clickX, clickY, imgData, centerColor, targetColor);
    ctx.putImageData(imgData, 0, 0);
});

inpFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        loadImage(event.target.result);
    };
    reader.readAsDataURL(file);
});

function hex2rgba(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
}

function getColor(x, y, imgData) {
    const i = point2Index(x, y);
    return [
        imgData.data[i],
        imgData.data[i + 1],
        imgData.data[i + 2],
        imgData.data[i + 3]
    ];
}

function point2Index(x, y) {
    return (y * cvs.width + x) * 4;
}

function diff(color1, color2) {
    return Math.abs(color1[0] - color2[0]) +
           Math.abs(color1[1] - color2[1]) +
           Math.abs(color1[2] - color2[2]) +
           Math.abs(color1[3] - color2[3]);
}

function changeColor(x, y, imgData, centerColor, targetColor) {
    const stack = [[x, y]];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const i = point2Index(x, y);
        const color = getColor(x, y, imgData);

        if (x < 0 || x >= cvs.width || y < 0 || y >= cvs.height) {
            continue;
        }

        if (diff(color, targetColor) === 0) {
            continue;
        }

        if (diff(color, centerColor) > 50) {
            continue;
        }

        imgData.data.set(targetColor, i);
        stack.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
    }
}