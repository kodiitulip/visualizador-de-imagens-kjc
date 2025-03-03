const maxAmount = 100;
const limitPerPage = 20;

const apiUrl = "https://picsum.photos/v2/list";
const grid = document.querySelector(".container");

/**
 * @param {string} id
 * @returns {( HTMLElement | null )} element
 */
const elemById = (id) => document.getElementById(id);

// Função para obter uma substring até encontrar uma substring específica
function getStringUntil(str, substr) {
  const index = str.indexOf(substr);
  return index !== -1 ? str.substring(0, index + substr.length) : null;
}

// Função para criar estrelas de avaliação
function createStars(id) {
  let stars = "";
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
async function loadImages(page = 1, limit = 20) {
  try {
    const response = await fetch(apiUrl + `?page=${page}&limit=${limit}`);
    const images = await response.json();

    grid.innerHTML = "";
    images.forEach((image) => {
      const tpl = elemById("image-container-template");
      const clonedContainer = tpl.content.cloneNode(true);

      const img = clonedContainer.querySelector("img.thumbnail");
      const rating = clonedContainer.querySelector(".rating");

      img.src = `https://picsum.photos/id/${image.id}/100/100`;
      img.addEventListener("click", () => openLightbox(image.download_url));

      rating.innerHTML = createStars(image.id);

      grid.appendChild(clonedContainer);
      updateRatingDisplay(image.id);
      populatePageContainer();
    });
  } catch (error) {
    console.error("Erro ao carregar as imagens:", error);
  }
}

function prevPage() {
  const currentPage = Number(localStorage.getItem("page")) || 1;
  const newPage = Math.min(
    Math.max(1, currentPage - 1),
    maxAmount / limitPerPage,
  );
  localStorage.setItem("page", newPage);
  loadImages(newPage);
}

function nextPage() {
  const currentPage = Number(localStorage.getItem("page")) || 1;
  const newPage = Math.max(
    Math.min(maxAmount / limitPerPage, currentPage + 1),
    1,
  );
  localStorage.setItem("page", newPage);
  loadImages(newPage);
}

function gotoPage(page) {
  localStorage.setItem("page", page);
  loadImages(page);
}

function populatePageContainer() {
  const pageAmount = maxAmount / limitPerPage;
  const currentPage = Number(localStorage.getItem("page")) || 1;

  const tpl = elemById("page-link-template");
  const container = elemById("page-num-container");

  container.innerHTML = "";
  for (let i = 1; i <= pageAmount; i++) {
    const clonedLink = tpl.content.cloneNode(true);
    const span = clonedLink.querySelector(".page-link");
    span.innerHTML = i + "";
    console.log(span);
    span.addEventListener("click", () => gotoPage(i));

    if (currentPage === i) span.classList.add("current");
    else span.classList.remove("current");

    container.appendChild(clonedLink);
  }
}

const currentPage = localStorage.getItem("page");

if (!currentPage) localStorage.setItem("page", 1);

// Inicializa o carregamento das imagens
loadImages(Number(currentPage));
