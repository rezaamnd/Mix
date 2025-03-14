function analyzeColor() {
    let hexColor = document.getElementById("inputColor").value;
    let rgb = hexToRgb(hexColor);

    let total = rgb.r + rgb.g + rgb.b;
    let red = (rgb.r / total) * 100 || 0;
    let green = (rgb.g / total) * 100 || 0;
    let blue = (rgb.b / total) * 100 || 0;

    let brightness = (rgb.r + rgb.g + rgb.b) / (255 * 3);
    let black = (1 - brightness) * 100;
    let white = brightness * Math.min(red, green, blue) * 0.5;

    // Normalisasi agar total 100%
    let sum = red + green + blue + black + white;
    red = (red / sum) * 100;
    green = (green / sum) * 100;
    blue = (blue / sum) * 100;
    black = (black / sum) * 100;
    white = (white / sum) * 100;

    document.getElementById("result").innerHTML = `
        <p>🔴 Merah: ${red.toFixed(1)}%</p>
        <p>🟢 Hijau: ${green.toFixed(1)}%</p>
        <p>🔵 Biru: ${blue.toFixed(1)}%</p>
        <p>⚫ Hitam: ${black.toFixed(1)}%</p>
        <p>⚪ Putih: ${white.toFixed(1)}%</p>
    `;
}

function resetColor() {
    document.getElementById("inputColor").value = "#ffffff";
    document.getElementById("result").innerHTML = "";
}

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return { 
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}
