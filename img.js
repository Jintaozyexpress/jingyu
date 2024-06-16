const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d', { willReadFrequently: true });
const inpColor = document.querySelector('input[type="color"]');
const inpFile = document.querySelector('input[type="file"]');

function loadImage(src) {
    const img = new Image();
    img.onload = function () {
        const scaleFactor = window.innerWidth / img.width;
        //condole.log(`Image loaded. Original width: ${img.width}, Original height: ${img.height}`);
        //condole.log(`Scale factor: ${scaleFactor}`);

        cvs.width = window.innerWidth;
        cvs.height = img.height * scaleFactor;
        //condole.log(`Canvas width: ${cvs.width}, Canvas height: ${cvs.height}`);

        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
        //condole.log('Image drawn on canvas.');
    };
    img.src = src;
}

function init() {
    loadImage('a.jpg'); // 默认加载服务器上的图片
}
init();

cvs.addEventListener('click', function (e) {
    const rect = cvs.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    //condole.log(`Canvas clicked at: (${clickX}, ${clickY})`);

    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const centerColor = getColor(clickX, clickY, imgData);
    const targetColor = hex2rgba(inpColor.value);
    //condole.log(`Center color: ${centerColor.join(',')}, Target color: ${targetColor.join(',')}`);

    changeColor(clickX, clickY, imgData, centerColor, targetColor);
    ctx.putImageData(imgData, 0, 0);
    //condole.log('Color changed and image updated.');
});

inpFile.addEventListener('change', function (e) {
    const file = e.target.files[0];
    //condole.log(`File selected: ${file.name}`);

    const reader = new FileReader();
    reader.onload = function (event) {
        loadImage(event.target.result);
        //condole.log('Image loaded from file input.');
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

        //condole.log(`Changing color at (${x}, ${y}) from ${color.join(',')} to ${targetColor.join(',')}`);
        imgData.data[i] = targetColor[0];
        imgData.data[i + 1] = targetColor[1];
        imgData.data[i + 2] = targetColor[2];
        imgData.data[i + 3] = targetColor[3];
        stack.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
    }
}