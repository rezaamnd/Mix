let colorReferences = [];

function addColor() {
    let newColor = document.getElementById("newColor").value;
    colorReferences.push(newColor);
    updateColorReferences();
}

function updateColorReferences() {
    let container = document.getElementById("colorReferences");
    container.innerHTML = "";
    colorReferences.forEach((color, index) => {
        let div = document.createElement("div");
        div.style.backgroundColor = color;
        
        let deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "×";
        deleteBtn.onclick = function() { removeColor(index); };

        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

function removeColor(index) {
    colorReferences.splice(index, 1);
    updateColorReferences();
}

function extractColor(event) {
    let file = event.target.files[0];
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let pixelData = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
        let color = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
        colorReferences.push(color);
        updateColorReferences();
    };
}

function extractTargetColor(event) {
    let file = event.target.files[0];
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let pixelData = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
        let color = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
        document.getElementById("targetColor").value = color;
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function calculateMix() {
    let targetColor = document.getElementById("targetColor").value;
    let resultDiv = document.getElementById("result");

    if (colorReferences.length === 0) {
        resultDiv.innerHTML = "<p>Tambahkan warna acuan dulu!</p>";
        return;
    }

    let mixResult = getColorMix(targetColor);
    resultDiv.innerHTML = `<p>Campuran terbaik: ${mixResult}</p>`;
}

function getColorMix(target) {
    return colorReferences.join(" + ");
}
