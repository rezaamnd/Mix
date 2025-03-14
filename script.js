let colorReferences = JSON.parse(localStorage.getItem("colorReferences")) || [];

document.addEventListener("DOMContentLoaded", () => {
    updateColorReferences();
});

function addColor() {
    let newColor = document.getElementById("newColor").value;
    colorReferences.push(hexToRgb(newColor));
    saveColors();
    updateColorReferences();
}

function updateColorReferences() {
    let container = document.getElementById("colorReferences");
    container.innerHTML = "";
    colorReferences.forEach((color, index) => {
        let div = document.createElement("div");
        div.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        
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
        let color = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };

        if (isTarget) {
            document.getElementById("targetColor").value = rgbToHex(color.r, color.g, color.b);
        } else {
            colorReferences.push(color);
            saveColors();
            updateColorReferences();
        }
    };
}

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function calculateMix() {
    let targetHex = document.getElementById("targetColor").value;
    let targetColor = hexToRgb(targetHex);
    
    if (colorReferences.length === 0) {
        document.getElementById("result").innerHTML = "<p>Tambahkan warna acuan dulu!</p>";
        return;
    }

    let proportions = getMixProportions(targetColor, colorReferences);
    
    let resultText = proportions.map(p => 
        `${(p.percentage * 100).toFixed(1)}% ${rgbToHex(p.color.r, p.color.g, p.color.b)}`
    ).join(" + ");

    document.getElementById("result").innerHTML = `<p>Campuran terbaik: ${resultText}</p>`;
}
function resetColorReferences() {
    colorReferences = [];
    saveColors();
    updateColorReferences();
}


function getMixProportions(target, references) {
    let distances = references.map(ref => {
        return {
            color: ref,
            distance: Math.sqrt(
                Math.pow(target.r - ref.r, 2) +
                Math.pow(target.g - ref.g, 2) +
                Math.pow(target.b - ref.b, 2)
            )
        };
    });

    // Inversi jarak agar warna yang lebih dekat mendapatkan bobot lebih besar
    let weights = distances.map(d => 1 / (d.distance + 1));  
    let totalWeight = weights.reduce((a, b) => a + b, 0);

    return distances.map((d, i) => ({
        color: d.color,
        percentage: weights[i] / totalWeight
    }));
      }
