let colorReferences = []; // Tidak menyimpan di localStorage

// Fungsi menambahkan warna acuan
function addColor() {
    let newColor = document.getElementById("newColor").value;
    let rgbColor = hexToRgb(newColor);
    colorReferences.push(rgbColor);
    updateColorReferences();
}

// Fungsi memperbarui daftar warna acuan di UI
function updateColorReferences() {
    let container = document.getElementById("colorReferences");
    container.innerHTML = "";

    colorReferences.forEach((color, index) => {
        let div = document.createElement("div");
        div.classList.add("color-box");
        div.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;

        let deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "×";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = function() { removeColor(index); };

        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

// Fungsi menghapus warna acuan tertentu
function removeColor(index) {
    colorReferences.splice(index, 1);
    updateColorReferences();
}

// Fungsi reset semua warna acuan
function resetColorReferences() {
    colorReferences = [];
    updateColorReferences();
}

// Fungsi reset warna target dan hasil
function resetTarget() {
    document.getElementById("targetColor").value = "#ffffff";
    document.getElementById("result").innerHTML = "";
}

// Fungsi konversi Hex ke RGB
function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Fungsi konversi RGB ke Hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

// Fungsi perhitungan campuran warna berdasarkan kedekatan RGB
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

// Fungsi menghitung proporsi warna berdasarkan jarak Euclidean RGB
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

    let weights = distances.map(d => 1 / (d.distance + 1));  
    let totalWeight = weights.reduce((a, b) => a + b, 0);

    return distances.map((d, i) => ({
        color: d.color,
        percentage: weights[i] / totalWeight
    }));
}
