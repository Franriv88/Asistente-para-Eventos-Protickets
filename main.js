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
// EVENT LISTENERS (Corregidos)
// ==========================================

// 1. Click para abrir selector de archivos
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// 2. Detectar cuando el usuario selecciona un archivo manualmente
fileInput.addEventListener('change', (e) => {
    if(e.target.files.length) handleFile(e.target.files[0]);
});

// 3. Drag & Drop Visuales
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

// ERROR ANTERIOR ESTABA AQUÍ: (Corregido)
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

// 4. Soltar la imagen (Drop)
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if(e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

// ==========================================
// PROCESAMIENTO CENTRAL
// ==========================================
function handleFile(file) {
    // Mostrar preview local inmediatamente
    const objectUrl = URL.createObjectURL(file);
    preview.src = objectUrl;
    preview.style.display = 'block';
    
    // Iniciar procesos
    uploadToImgBB(file);
    extractColors(preview);
}

// ==========================================
// LÓGICA DE SUBIDA (ImgBB)
// ==========================================
async function uploadToImgBB(file) {
    statusText.textContent = "Subiendo y analizando...";
    statusText.style.color = "#007bff";
    urlOutput.value = "";

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
        } else {
            throw new Error("Error API ImgBB");
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = "⚠️ Error al subir (pero los colores funcionarán).";
        statusText.style.color = "orange";
    }
}

// ==========================================
// LÓGICA DE COLORES
// ==========================================
function extractColors(imgElement) {
    // Asegurarse de que la imagen cargó antes de leer píxeles
    if (imgElement.complete) {
        processColors();
    } else {
        imgElement.addEventListener('load', processColors);
    }

    function processColors() {
        try {
            // Extraemos 12 colores con calidad máxima (1)
            const palette = colorThief.getPalette(imgElement, 12, 1);
            renderPalette(palette);
        } catch (e) {
            console.log("Error extrayendo colores", e);
        }
    }
}

// Función para decidir si el texto es Negro o Blanco
function getContrastYIQ(r, g, b) {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function renderPalette(palette) {
    paletteContainer.innerHTML = '';
    paletteSection.style.display = 'block';

    palette.forEach(color => {
        const rgbString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        const hexString = rgbToHex(color[0], color[1], color[2]);
        
        // Calcular contraste
        const textColor = getContrastYIQ(color[0], color[1], color[2]);
        
        // Borde sutil adaptable
        const borderColor = textColor === 'black' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)';

        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.backgroundColor = rgbString;
        card.style.color = textColor;
        card.style.setProperty('--border-color', borderColor);

        // Estructura HTML Vertical
        card.innerHTML = `
            <div class="color-details">
                
                <div class="color-row">
                    <div class="code-info">
                        <span class="code-label">HEX</span>
                        <span class="code-value">${hexString}</span>
                    </div>
                    <button class="mini-copy" onclick="copiarTexto('${hexString}')">COPIAR</button>
                </div>

                <div class="color-row">
                    <div class="code-info">
                        <span class="code-label">CSS</span>
                        <span class="code-value">${rgbString}</span>
                    </div>
                    <button class="mini-copy" onclick="copiarTexto('${rgbString}')">COPIAR</button>
                </div>

            </div>
        `;
        paletteContainer.appendChild(card);
    });
}

// ==========================================
// UTILIDADES
// ==========================================
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        // Aquí podrías poner un alert o feedback visual si quieres
    });
}

function copiarInput(id) {
    const input = document.getElementById(id);
    navigator.clipboard.writeText(input.value).then(() => {
        // alert("URL copiada con éxito");
    });
}


// ==========================================
// ⚡ SECCIÓN DE CÓDIGOS GUARDADOS (SNIPPETS)
// ==========================================

// 1. PEGA AQUÍ TU CÓDIGO HTML DE "QUENTRO" (Entre las comillas invertidas)
const CODIGO_QUENTRO = `
<div class="container_quentro">
        <div class="icons">
            <div class="icon-container">
                <p>Descargá Quentro desde tu celular acá:</p>
                <a href="https://play.google.com/store/apps/details?id=com.getcrowder.quentro&pli=1" target="_blank">
                    <img src="https://cdn.getcrowder.com/images/fa97c118-82ae-4396-9f16-b784812d8fd8-playstore.png" alt="Ícono 1" class="icon">
                </a>
            </div>
            <div class="icon-container">
                <!-- <p>Ícono 2</p> -->
                <a href="https://apps.apple.com/us/app/quentro" target="_blank">
                    <img src="https://cdn.getcrowder.com/images/3fbc8b88-791d-4863-b06d-2c8b00046d48-game.png" alt="Ícono 2" class="icon">
                </a>
            </div>
        </div>
        <div class="item">
            <p>Instructivo</p>
            <a href="https://drive.google.com/file/d/10gRr4A2m8Nfjdjc6S8VgcWh324JGzek3/view" target="_blank">
                <img src="https://cdn.getcrowder.com/images/d237bbbe-6942-47e9-be34-bb9da929c46b-quentro-png.png" alt="Imagen Principal" class="link-image">
            </a>
        </div>
    </div>
`;

// 2. PEGA AQUÍ TU CÓDIGO CSS DE "LANDING" (Entre las comillas invertidas)
const CODIGO_LANDING = `
.event_blocks {
    background: #000 url(https://cdn.getcrowder.com/images/eea454f1-a270-48bc-b4c3-70e4a70cb23b-fondo-1920x720.jpg) no-repeat center center fixed;
    background-size: cover;
}

.text{
   color: #fff;
   text-align: center;
}

.text strong{
    color:#fff;
}

summary{
   color: #fff;
}

.container_quentro {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        .item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .item p {
            display: flex;
            align-items: center;
            margin: 0;
        }
        .link-image {
            width: 100%;
            max-width: 100px; /* Ajusta este valor según necesites */
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .link-image:hover {
            transform: scale(1.1);
        }
        .icons {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 15px;
        }
        .icon-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .icon-container p {
            display: flex;
            align-items: center;
            margin: 0;
        }
        .icon {
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .icon:hover {
            transform: scale(1.2);
        }
        
        .container_quentro p{
            font-size: 23px;
            color: #FFF;
        }

.grid_element .information {
    background: none;
}

`;

// Función para copiar
function copiarCodigo(tipo) {
    let textoACopiar = "";
    let nombre = "";

    if (tipo === 'quentro') {
        textoACopiar = CODIGO_QUENTRO;
        nombre = "Información Quentro";
    } else if (tipo === 'css') {
        textoACopiar = CODIGO_LANDING;
        nombre = "CSS Landing";
    }

    navigator.clipboard.writeText(textoACopiar).then(() => {
        
    });
}

//===========================================
//    CREADOR DE ONDAS
//===========================================
let listaColores = ['#007bff', '#ff4d4d']; // Colores iniciales
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

// Iniciar la app
renderColorPickers();

function renderColorPickers() {
    const container = document.getElementById('colorsContainer');
    container.innerHTML = '';
    
    listaColores.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = 'color-picker-unit';
        div.innerHTML = `
            <input type="color" value="${color}" oninput="updateColor(${index}, this.value)">
            <input type="text" value="${color}" style="width:70px; font-size:12px; text-align:center;" 
                   onchange="updateColor(${index}, this.value)">
            ${index > 0 ? `<button class="btn-remove-color" onclick="removeColor(${index})">Eliminar</button>` : ''}
        `;
        container.appendChild(div);
    });
    dibujarOnda();
}

function updateColor(index, value) {
    // Validar que sea un hex válido antes de asignar
    if (value.startsWith('#') && (value.length === 7 || value.length === 4)) {
        listaColores[index] = value;
        renderColorPickers(); // Re-renderiza para sincronizar ambos inputs
    }
}

function addColor() {
    listaColores.push('#000000');
    renderColorPickers();
}

function removeColor(index) {
    listaColores.splice(index, 1);
    renderColorPickers();
}

function dibujarOnda() {
    const style = document.getElementById('waveStyle').value;
    const thickness = parseFloat(document.getElementById('waveThickness').value);
    document.getElementById('thicknessValue').textContent = thickness + "px";
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (listaColores.length === 0) return;

    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (style === 'sinusoidal') {
        listaColores.forEach((col, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = col;
            ctx.globalAlpha = 0.8;
            for (let i = 0; i < canvas.width; i++) {
                const y = 138 + Math.sin(i * 0.01 + idx) * 80 * Math.sin(i * 0.002 + idx);
                ctx.lineTo(i, y);
            }
            ctx.stroke();
        });
    } 

    else if (style === 'bars') {
        const step = 20; 
        for (let i = 0; i < canvas.width; i += step) {
            const h = Math.random() * 200 + 20;
            ctx.fillStyle = listaColores[Math.floor(i / step) % listaColores.length];
            const barWidth = thickness * 2; 
            ctx.beginPath();
            ctx.roundRect(i, 138 - h/2, barWidth, h, barWidth/2);
            ctx.fill();
        }
    } 

    else if (style === 'pulse') {
        listaColores.forEach((col, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = col;
            ctx.moveTo(0, 138);
            for (let i = 0; i < canvas.width; i++) {
                let noise = 0;
                [0.2, 0.5, 0.8].forEach(pos => {
                    noise += Math.sin(i * 0.04) * Math.exp(-Math.pow((i - (canvas.width * pos + (idx * 30))) / 80, 2)) * 120;
                });
                ctx.lineTo(i, 138 + noise);
            }
            ctx.stroke();
        });
    }

    else if (style === 'electro') {
        listaColores.forEach((col, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = col;
            ctx.moveTo(0, 138);
            for (let i = 0; i < canvas.width; i += 2) {
                let y = 138;
                if ((i + idx * 100) % 400 < 60) {
                    const localX = (i + idx * 100) % 400;
                    if (localX < 20) y -= localX * 2;
                    else if (localX < 40) y = (138 - 40) + (localX - 20) * 6;
                    else y = (138 + 80) - (localX - 40) * 4;
                }
                ctx.lineTo(i, y);
            }
            ctx.stroke();
        });
    }

    else if (style === 'bubbles') {
        // Burbujas Clásicas (Rellenas)
        listaColores.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < canvas.width; i += 40) {
                const y = 138 + Math.sin(i * 0.005 + idx) * 80;
                const size = Math.random() * (thickness * 5) + 2;
                ctx.beginPath();
                ctx.arc(i, y + (Math.random() * 20), size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    else if (style === 'bubbles_pro') {
        // NUEVO: Burbujas Pro (Mezcla de Relleno y Contorno)
        listaColores.forEach((col, idx) => {
            for (let i = 0; i < canvas.width; i += 30) {
                const y = 138 + Math.sin(i * 0.005 + idx) * 90;
                const size = Math.random() * (thickness * 4) + 3;
                ctx.beginPath();
                ctx.arc(i, y + (Math.random() * 30), size, 0, Math.PI * 2);
                if (i % 60 === 0) {
                    ctx.strokeStyle = col;
                    ctx.globalAlpha = 0.8;
                    ctx.stroke();
                } else {
                    ctx.fillStyle = col;
                    ctx.globalAlpha = 0.4;
                    ctx.fill();
                }
            }
        });
    }

    else if (style === 'cyber') {
        // NUEVO: Estilo Digital / Matrix
        listaColores.forEach((col, idx) => {
            ctx.fillStyle = col;
            const w = thickness * 3;
            for (let i = 0; i < canvas.width; i += w + 5) {
                const h = Math.abs(Math.sin(i * 0.01 + idx)) * 150;
                ctx.globalAlpha = Math.random();
                ctx.fillRect(i, 138 - h/2, w, h);
            }
        });
    }

    else if (style === 'fire') {
        // NUEVO: Estilo Fuego / Llamas
        listaColores.forEach((col, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = col;
            ctx.moveTo(0, 138);
            for (let i = 0; i < canvas.width; i += 5) {
                const noise = (Math.random() * thickness * 10);
                const y = 138 + Math.sin(i * 0.01 + idx) * 80 - noise;
                ctx.lineTo(i, y);
            }
            ctx.stroke();
        });
    }

    else if (style === 'dna') {
        // NUEVO: Estilo ADN / Conexiones
        listaColores.forEach((col, idx) => {
            ctx.strokeStyle = col;
            ctx.fillStyle = col;
            for (let i = 0; i < canvas.width; i += 40) {
                const y1 = 138 + Math.sin(i * 0.01 + idx) * 80;
                const y2 = 138 + Math.sin(i * 0.01 + idx + Math.PI) * 80;
                
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(i, y1);
                ctx.lineTo(i, y2);
                ctx.stroke();
                
                ctx.globalAlpha = 1;
                ctx.beginPath(); ctx.arc(i, y1, thickness, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(i, y2, thickness, 0, Math.PI*2); ctx.fill();
            }
        });
    }

    else if (style === 'smoke') {
        listaColores.forEach((col, idx) => {
            const seed = Math.random() * 100;
            for (let s = 0; s < 15; s++) {
                ctx.beginPath();
                ctx.strokeStyle = col;
                ctx.globalAlpha = 0.02 * (thickness / 2);
                ctx.moveTo(0, 138);
                for (let i = 0; i < canvas.width; i += 10) {
                    const noise = Math.sin(i * 0.002 + s + seed) * Math.cos(i * 0.005 + idx) * 150;
                    ctx.bezierCurveTo(i - 5, 138 + noise, i - 2, 138 + noise, i, 138 + noise);
                }
                ctx.stroke();
            }
        });
    }

    else if (style === 'rock') {
        listaColores.forEach((col, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = col;
            ctx.moveTo(0, 138);
            for (let i = 0; i < canvas.width; i += 10) {
                const spike = (Math.random() - 0.5) * 160 * Math.sin(i * 0.005 + idx);
                ctx.lineTo(i, 138 + spike);
            }
            ctx.stroke();
        });
    }
}

function descargarOnda() {
    const link = document.createElement('a');
    link.download = `onda-protickets-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}