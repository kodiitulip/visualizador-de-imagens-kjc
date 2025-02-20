const apiUrl = "https://picsum.photos/v2/list?page=2&limit=20";
const grid = document.querySelector(".container");

// Função para obter uma substring até encontrar uma substring específica
function getStringUntil(str, substr) {
    const index = str.indexOf(substr);
    return index !== -1 ? str.substring(0, index + substr.length) : null;
}

// Função para criar estrelas de avaliação
function createStars(id) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star" data-id="${id}" data-rating="${i}" onclick="rateImage(${id}, ${i})">&#9734;</span>`;
    }
    return stars;
}

// Função para avaliar uma imagem e salvar a avaliação no localStorage
function rateImage(id, rating) {
    localStorage.setItem(id, rating);
    updateRatingDisplay(id);
}

// Função para atualizar a exibição das estrelas com base na avaliação salva
function updateRatingDisplay(id) {
    const rating = localStorage.getItem(id);
    if (rating) {
        const stars = document.querySelectorAll(`.star[data-id="${id}"]`);
        stars.forEach((star, index) => {
            star.innerHTML = index < rating ? "&#9733;" : "&#9734;";
        });
    }
}

// Função para abrir a lightbox com a imagem em tamanho maior
function openLightbox(url) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    lightboxImage.src = url;
    lightbox.style.display = "flex";
}

// Função para fechar a lightbox
function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";
}

// Função para carregar as imagens da API e exibi-las no grid
async function loadImages() {
    try {
        const response = await fetch(apiUrl);
        const images = await response.json();

        images.forEach(image => {
            const div = document.createElement("div");
            div.classList.add("image-container");

            div.innerHTML = `
                <img src="https://picsum.photos/id/${image.id}/100/100" class="thumbnail" onclick="openLightbox('${image.download_url}')"/>
                <div class="rating">${createStars(image.id)}</div>
            `;

            grid.appendChild(div);
            updateRatingDisplay(image.id);
        });
    } catch (error) {
        console.error("Erro ao carregar as imagens:", error);
    }
}

// Inicializa o carregamento das imagens
loadImages();