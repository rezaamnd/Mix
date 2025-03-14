let colorReferences = []; // Warna acuan tidak disimpan setelah refresh

document.addEventListener("DOMContentLoaded", () => {
    updateColorReferences();
});

// Tambahkan warna acuan
function addColor() {
    let newColor = document.getElementById("newColor").value;
    let rgbColor = hexToLinearRgb(newColor);
    colorReferences.push(rgbColor);
    updateColorReferences();
}

// Perbarui tampilan warna acuan
function updateColorReferences() {
    let container = document.getElementById("colorReferences");
    container.innerHTML = "";

    colorReferences.forEach((color, index) => {
        let div = document.createElement("div");
        div.classList.add("color-box");
        div.style.backgroundColor = linearRgbToHex(color);

        let deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "×";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = function() { removeColor(index); };

        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

// Hapus satu warna acuan
function removeColor(index) {
    colorReferences.splice(index, 1);
    updateColorReferences();
}

// Reset semua warna acuan
function resetColorReferences() {
    colorReferences = [];
    updateColorReferences();
}

// Reset warna target dan hasil
function resetTarget() {
    document.getElementById("targetColor").value = "#ffffff";
    document.getElementById("result").innerHTML = "";
}

// Konversi HEX ke Linear RGB
function hexToLinearRgb(hex) {
    let rgb = hexToRgb(hex);
    return {
        r: srgbToLinear(rgb.r / 255),
        g: srgbToLinear(rgb.g / 255),
        b: srgbToLinear(rgb.b / 255)
    };
}

// Konversi Linear RGB ke HEX
function linearRgbToHex(linear) {
    return rgbToHex(
        Math.round(linearToSrgb(linear.r) * 255),
        Math.round(linearToSrgb(linear.g) * 255),
        Math.round(linearToSrgb(linear.b) * 255)
    );
}

// Konversi HEX ke RGB biasa
function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Konversi RGB biasa ke HEX
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

// Konversi sRGB ke Linear RGB
function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Konversi Linear RGB ke sRGB
function linearToSrgb(c) {
    return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// Hitung campuran warna
function calculateMix() {
    let targetHex = document.getElementById("targetColor").value;
    let targetColor = hexToLinearRgb(targetHex);
    
    if (colorReferences.length === 0) {
        document.getElementById("result").innerHTML = "<p>Tambahkan warna acuan dulu!</p>";
        return;
    }

    let proportions = getMixProportions(targetColor, colorReferences);

    let resultText = proportions.map(p => 
        `${(p.percentage * 100).toFixed(1)}% ${linearRgbToHex(p.color)}`
    ).join(" + ");

    document.getElementById("result").innerHTML = `<p>Campuran terbaik: ${resultText}</p>`;
}

// Hitung proporsi campuran warna dengan metode Linear RGB
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

    let weights = distances.map(d => 1 / (d.distance + 0.01));  // Hindari pembagian dengan nol
    let totalWeight = weights.reduce((a, b) => a + b, 0);

    return distances.map((d, i) => ({
        color: references[i],
        percentage: weights[i] / totalWeight
    }));
}
