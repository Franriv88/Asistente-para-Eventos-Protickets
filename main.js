// ==========================================
// CONFIGURACIÓN
// ==========================================
const API_KEY = '95cf25fe405f4d1796a0e919e1953a6d'; 
const colorThief = new ColorThief();

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const statusText = document.getElementById('statusText');
const urlOutput = document.getElementById('urlOutput');
const preview = document.getElementById('preview');
const paletteSection = document.getElementById('paletteSection');
const paletteContainer = document.getElementById('paletteContainer');

// ==========================================
// EVENT LISTENERS
// ==========================================
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if(e.target.files.length) handleFile(e.target.files[0]);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if(e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

// ==========================================
// PROCESAMIENTO DE IMAGEN Y COLORES
// ==========================================
function handleFile(file) {
    const objectUrl = URL.createObjectURL(file);
    preview.src = objectUrl;
    preview.style.display = 'block';
    uploadToImgBB(file);
    extractColors(preview);
}

async function uploadToImgBB(file) {
    statusText.textContent = "Subiendo y analizando...";
    statusText.style.color = "#007bff";
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            urlOutput.value = data.data.url;
            statusText.textContent = "✅ Imagen procesada con éxito.";
            statusText.style.color = "green";
        }
    } catch (error) {
        statusText.textContent = "⚠️ Error al subir.";
        statusText.style.color = "orange";
    }
}

function extractColors(imgElement) {
    if (imgElement.complete) { processColors(); } 
    else { imgElement.addEventListener('load', processColors); }

    function processColors() {
        try {
            const palette = colorThief.getPalette(imgElement, 12, 1);
            renderPalette(palette);
        } catch (e) { console.log("Error extrayendo colores", e); }
    }
}

function renderPalette(palette) {
    paletteContainer.innerHTML = '';
    paletteSection.style.display = 'block';
    palette.forEach(color => {
        const rgbString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        const hexString = rgbToHex(color[0], color[1], color[2]);
        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.backgroundColor = rgbString;
        card.style.color = getContrastYIQ(color[0], color[1], color[2]);
        card.innerHTML = `
            <div class="color-details">
                <div class="color-row">
                    <div class="code-info"><span class="code-label">HEX</span><span class="code-value">${hexString}</span></div>
                    <button class="mini-copy" onclick="copiarTexto('${hexString}')">COPIAR</button>
                </div>
                <div class="color-row">
                    <div class="code-info"><span class="code-label">CSS</span><span class="code-value">${rgbString}</span></div>
                    <button class="mini-copy" onclick="copiarTexto('${rgbString}')">COPIAR</button>
                </div>
            </div>`;
        paletteContainer.appendChild(card);
    });
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function getContrastYIQ(r, g, b) {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function copiarTexto(texto) { navigator.clipboard.writeText(texto); }

// ==========================================
// ⚡ SNIPPETS
// ==========================================
// ==========================================
// ⚡ SNIPPETS (Carga desde archivos externos)
// ==========================================

async function copiarCodigo(tipo) {
    // Usamos ./ para forzar la ruta relativa a la carpeta actual
    const nombreArchivo = tipo === 'quentro' ? 'quentroCode.txt' : 'css_paraLanding.txt';
    const rutaArchivo = `./${nombreArchivo}`;
    
    try {
        const respuesta = await fetch(rutaArchivo);
        
        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar ${nombreArchivo} (Status: ${respuesta.status})`);
        }
        
        const texto = await respuesta.text();
        await navigator.clipboard.writeText(texto);
        
        alert(`✅ Código de ${tipo} copiado.`);

    } catch (error) {
        console.error("Error en fetch:", error);
        alert("Error: Verifica que los archivos .txt existan en GitHub.");
    }
}

// ==========================================
// 🌊 CREADOR DE ONDAS (CORREGIDO & LIMITADO)
// ==========================================
let listaColores = ['#007bff', '#ff4d4d'];
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

document.querySelectorAll('.btn-style').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.btn-style').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const styleInput = document.getElementById('waveStyle');
        styleInput.value = this.getAttribute('data-value');
        dibujarOnda();
    });
});

function renderColorPickers() {
    const container = document.getElementById('colorsContainer');
    container.innerHTML = '';
    listaColores.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = 'color-picker-unit';
        div.innerHTML = `
            <input type="color" value="${color}" oninput="updateColor(${index}, this.value)">
            <input type="text" value="${color}" style="width:70px; font-size:12px; text-align:center;" onchange="updateColor(${index}, this.value)">
            ${index > 0 ? `<button class="btn-remove-color" onclick="removeColor(${index})">Eliminar</button>` : ''}`;
        container.appendChild(div);
    });
    dibujarOnda();
}

function updateColor(index, value) {
    if (value.startsWith('#') && (value.length === 7 || value.length === 4)) {
        listaColores[index] = value;
        renderColorPickers();
    }
}

function addColor() { listaColores.push('#000000'); renderColorPickers(); }
function removeColor(index) { listaColores.splice(index, 1); renderColorPickers(); }

function dibujarOnda() {
    const style = document.getElementById('waveStyle').value;
    const thickness = parseFloat(document.getElementById('waveThickness').value);
    document.getElementById('thicknessValue').textContent = thickness + "px";
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (listaColores.length === 0) return;

    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const centroY = 138;
    const minY = 10;
    const maxY = 267;

    const clamp = (val) => Math.max(minY, Math.min(maxY, val));

    listaColores.forEach((col, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.globalAlpha = 1.0;

        if (style === 'sinusoidal') {
            ctx.globalAlpha = 0.8;
            for (let i = 0; i < canvas.width; i++) {
                const y = centroY + Math.sin(i * 0.01 + idx) * 80 * Math.sin(i * 0.002 + idx);
                ctx.lineTo(i, clamp(y));
            }
            ctx.stroke();
        } 
        else if (style === 'vinyl') {
            ctx.globalAlpha = 0.6;
            for (let r = 0; r < 3; r++) {
                ctx.beginPath();
                for (let i = 0; i < canvas.width; i += 5) {
                    const wave = Math.sin(i * 0.05 + idx + r) * 10;
                    const y = centroY + wave + (r * 30 - 30);
                    ctx.lineTo(i, clamp(y));
                }
                ctx.stroke();
            }
        }
        else if (style === 'bars') {
            const step = 20;
            for (let i = 0; i < canvas.width; i += step) {
                if(Math.floor(i / step) % listaColores.length === idx) {
                    const h = Math.random() * 200 + 20;
                    ctx.beginPath();
                    ctx.roundRect(i, clamp(centroY - h/2), thickness * 2, Math.min(h, 250), thickness);
                    ctx.fill();
                }
            }
        }
        else if (style === 'pulse') {
            ctx.moveTo(0, centroY);
            for (let i = 0; i < canvas.width; i++) {
                let noise = 0;
                [0.2, 0.5, 0.8].forEach(pos => {
                    noise += Math.sin(i * 0.04) * Math.exp(-Math.pow((i - (canvas.width * pos + (idx * 30))) / 80, 2)) * 120;
                });
                ctx.lineTo(i, clamp(centroY + noise));
            }
            ctx.stroke();
        }
        else if (style === 'electro') {
            ctx.moveTo(0, centroY);
            for (let i = 0; i < canvas.width; i += 2) {
                let y = centroY;
                if ((i + idx * 100) % 400 < 60) {
                    const localX = (i + idx * 100) % 400;
                    if (localX < 20) y -= localX * 2;
                    else if (localX < 40) y = (centroY - 40) + (localX - 20) * 6;
                    else y = (centroY + 80) - (localX - 40) * 4;
                }
                ctx.lineTo(i, clamp(y));
            }
            ctx.stroke();
        }
        else if (style === 'bubbles' || style === 'bubbles_pro') {
            ctx.globalAlpha = 0.5;
            for (let i = 0; i < canvas.width; i += 40) {
                const y = centroY + Math.sin(i * 0.005 + idx) * 80;
                const size = Math.random() * (thickness * 5) + 2;
                ctx.beginPath();
                ctx.arc(i, clamp(y + (Math.random() * 20)), size, 0, Math.PI * 2);
                if(style === 'bubbles_pro' && i % 80 === 0) ctx.stroke(); else ctx.fill();
            }
        }
        else if (style === 'stars') {
            for (let i = 0; i < canvas.width; i += 15) {
                const yBase = centroY + Math.sin(i * 0.01 + idx) * 80;
                for (let p = 0; p < 3; p++) {
                    ctx.globalAlpha = Math.random() * 0.5;
                    ctx.beginPath();
                    ctx.arc(i + (Math.random()-0.5)*20, clamp(yBase + (Math.random()-0.5)*40), Math.random()*thickness, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        }
        else if (style === 'rock') {
            ctx.moveTo(0, centroY);
            for (let i = 0; i < canvas.width; i += 10) {
                let y = centroY + (Math.random() - 0.5) * 160 * Math.sin(i * 0.005 + idx);
                ctx.lineTo(i, clamp(y));
            }
            ctx.stroke();
        }
        else if (style === 'fire') {
            ctx.moveTo(0, centroY);
            for (let i = 0; i < canvas.width; i += 5) {
                let y = centroY + Math.sin(i * 0.01 + idx) * 80 - (Math.random() * thickness * 8);
                ctx.lineTo(i, clamp(y));
            }
            ctx.stroke();
        }
        else if (style === 'dna') {
            for (let i = 0; i < canvas.width; i += 40) {
                const y1 = centroY + Math.sin(i * 0.01 + idx) * 80;
                const y2 = centroY + Math.sin(i * 0.01 + idx + Math.PI) * 80;
                ctx.globalAlpha = 0.2; ctx.moveTo(i, clamp(y1)); ctx.lineTo(i, clamp(y2)); ctx.stroke();
                ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(i, clamp(y1), thickness, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(i, clamp(y2), thickness, 0, Math.PI*2); ctx.fill();
            }
        }
        else if (style === 'smoke') {
            const numLineas = 20;
            for (let s = 0; s < numLineas; s++) {
                ctx.beginPath();
                ctx.globalAlpha = 0.1; 
                ctx.lineWidth = thickness * 0.3;
                ctx.moveTo(0, centroY);
                for (let i = 0; i < canvas.width; i += 5) {
                    const desfase = s * 0.05;
                    const amp = 100 * Math.sin(i * 0.002 + idx);
                    const y = centroY + Math.sin(i * 0.005 + desfase + idx) * amp;
                    ctx.lineTo(i, clamp(y));
                }
                ctx.stroke();
            }
        }
        else if (style === 'cyber') {
            const w = thickness * 4;
            for (let i = 0; i < canvas.width; i += w + 5) {
                const h = Math.abs(Math.sin(i * 0.01 + idx)) * 150;
                ctx.globalAlpha = Math.random();
                ctx.fillRect(i, clamp(centroY - h/2), w, Math.min(h, 250));
            }
        }
        else if (style === 'lightning') {
            ctx.beginPath();
            ctx.lineWidth = thickness * 0.5;
            ctx.moveTo(0, centroY);
            let curY = centroY;
            for (let i = 0; i < canvas.width; i += 15) {
                let salto = (Math.random() - 0.5) * 120 * Math.sin(i * 0.01 + idx);
                curY = clamp(curY + salto);
                ctx.lineTo(i, curY);
                if (Math.random() > 0.8) {
                    ctx.lineTo(i + 10, clamp(curY + 40));
                    ctx.moveTo(i, curY);
                }
            }
            ctx.stroke();
        }
        else if (style === 'radar') {
            for (let i = 0; i < canvas.width; i += 25) {
                const intensity = Math.abs(Math.sin(i * 0.01 + idx));
                ctx.globalAlpha = intensity;
                ctx.lineWidth = thickness * intensity;
                ctx.beginPath();
                ctx.moveTo(i, clamp(centroY - (intensity * 120)));
                ctx.lineTo(i, clamp(centroY + (intensity * 120)));
                ctx.stroke();
            }
        }
        else if (style === 'lava') {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.moveTo(0, centroY);
            for (let i = 0; i < canvas.width; i += 20) {
                const y = centroY + Math.sin(i * 0.005 + idx) * 100 * Math.cos(i * 0.002 + idx);
                const yc = clamp(y);
                ctx.bezierCurveTo(i - 10, clamp(yc + 20), i - 10, clamp(yc - 20), i, yc);
            }
            ctx.lineTo(canvas.width, centroY);
            ctx.fill();
        }
        else if (style === 'glitch') {
            for (let i = 0; i < canvas.width; i += 30) {
                const h = Math.sin(i * 0.01 + idx) * 100;
                ctx.strokeRect(i + (Math.random()-0.5)*20, clamp(centroY - h), 15, 2);
            }
        }
        else if (style === 'strings') {
            ctx.globalAlpha = 0.4;
            for (let i = 0; i < canvas.width; i += 15) {
                const y1 = centroY + Math.sin(i * 0.01 + idx) * 90;
                const y2 = centroY + Math.cos(i * 0.015 + idx) * 60;
                ctx.beginPath();
                ctx.moveTo(i, clamp(y1));
                ctx.lineTo(i, clamp(y2));
                ctx.stroke();
            }
        }
        else if (style === 'podcast') {
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < canvas.width; i += 4) {
                const val = Math.sin(i * 0.02 + idx) * Math.cos(i * 0.005) * 100;
                ctx.moveTo(i, clamp(centroY - val)); ctx.lineTo(i, clamp(centroY + val));
            }
            ctx.stroke();
        }
    });
}

function descargarOnda() {
    const link = document.createElement('a');
    link.download = `onda-protickets-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function cambiarFondoPreview(color, btn) {
    const wrapper = document.getElementById('canvasWrapper');
    if (color === 'white') {
        wrapper.classList.add('bg-white');
    } else {
        wrapper.classList.remove('bg-white');
    }
    btn.parentElement.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

renderColorPickers();