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
    input.select();
    document.execCommand('copy');
    alert("URL copiada");
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

