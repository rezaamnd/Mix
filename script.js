let colorReferences = JSON.parse(localStorage.getItem("colorReferences")) || [];

document.addEventListener("DOMContentLoaded", () => {
    updateColorReferences();
});

function addColor() {
    let newColor = document.getElementById("newColor").value;
    colorReferences.push(hexToCmyk(newColor));
    saveColors();
    updateColorReferences();
}

function updateColorReferences() {
    let container = document.getElementById("colorReferences");
    container.innerHTML = "";
    colorReferences.forEach((color, index) => {
        let div = document.createElement("div");
        div.style.backgroundColor = `rgb(${cmykToRgb(color).join(",")})`;
        
        let deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "×";
        deleteBtn.onclick = function() { removeColor(index); };

        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

function removeColor(index) {
    colorReferences.splice(index, 1);
    saveColors();
    updateColorReferences();
}

function extractColor(event, isTarget = false) {
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
        let color = rgbToCmyk(pixelData[0], pixelData[1], pixelData[2]);

        if (isTarget) {
            document.getElementById("targetColor").value = `cmyk(${color.join(",")})`;
        } else {
            colorReferences.push(color);
            saveColors();
            updateColorReferences();
        }
    };
}

function hexToCmyk(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return rgbToCmyk(
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255
    );
}

function rgbToCmyk(r, g, b) {
    let k = 1 - Math.max(r / 255, g / 255, b / 255);
    let c = (1 - r / 255 - k) / (1 - k) || 0;
    let m = (1 - g / 255 - k) / (1 - k) || 0;
    let y = (1 - b / 255 - k) / (1 - k) || 0;
    return [c.toFixed(2), m.toFixed(2), y.toFixed(2), k.toFixed(2)];
}

function cmykToRgb(cmyk) {
    let c = parseFloat(cmyk[0]), m = parseFloat(cmyk[1]), y = parseFloat(cmyk[2]), k = parseFloat(cmyk[3]);
    let r = 255 * (1 - c) * (1 - k);
    let g = 255 * (1 - m) * (1 - k);
    let b = 255 * (1 - y) * (1 - k);
    return [Math.round(r), Math.round(g), Math.round(b)];
}

function calculateMix() {
    let targetValue = document.getElementById("targetColor").value;
    let targetColor = targetValue.startsWith("cmyk") ? targetValue.slice(5, -1).split(",").map(Number) : hexToCmyk(targetValue);
    
    if (colorReferences.length === 0) {
        document.getElementById("result").innerHTML = "<p>Tambahkan warna acuan dulu!</p>";
        return;
    }

    let proportions = getMixProportions(targetColor, colorReferences);
    
    let resultText = proportions.map(p => 
        `${(p.percentage * 100).toFixed(1)}% cmyk(${p.color.join(",")})`
    ).join(" + ");

    document.getElementById("result").innerHTML = `<p>Campuran terbaik: ${resultText}</p>`;
}

function getMixProportions(target, references) {
    let totalWeight = references.length;
    return references.map(ref => ({
        color: ref,
        percentage: 1 / totalWeight
    }));
}

function saveColors() {
    localStorage.setItem("colorReferences", JSON.stringify(colorReferences));
}
