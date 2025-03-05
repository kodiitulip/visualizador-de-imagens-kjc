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

let currentSlide = 0;
let slidesContainer;

// Função para abrir o modal com o carrossel
function openLightbox(url, images, index) {
  const lightbox = document.getElementById("lightbox");
  const carousel = lightbox.querySelector(".carousel");
  slidesContainer = carousel.querySelector(".slides");

  // Limpa o carrossel antes de adicionar novas imagens
  slidesContainer.innerHTML = "";

  // Adiciona as imagens ao carrossel
  images.forEach((image, i) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");

    const img = document.createElement("img");
    img.src = `https://picsum.photos/id/${image.id}/800/600`;
    img.alt = `Imagem de ${image.author}`;
    img.classList.add("carousel-image");

    slide.appendChild(img);
    slidesContainer.appendChild(slide);
  });

  // Exibe o slide correspondente à imagem clicada
  currentSlide = index;
  showSlide(currentSlide);

  // Exibe o modal
  lightbox.style.display = "flex";
}

// Função para fechar o modal
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
}

// Função para mostrar um slide específico
function showSlide(index) {
  const slides = document.querySelectorAll(".slide");

  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }

  const offset = -currentSlide * 100;
  slidesContainer.style.transform = `translateX(${offset}%)`;
}

// Função para avançar para o próximo slide
function nextSlide(event) {
  event.stopPropagation(); // Impede a propagação do evento
  showSlide(currentSlide + 1);
}

// Função para voltar ao slide anterior
function prevSlide(event) {
  event.stopPropagation(); // Impede a propagação do evento
  showSlide(currentSlide - 1);
}

// Modificar a função loadImages para passar as imagens e o índice ao abrir o modal
async function loadImages(page = 1, limit = 20) {
  try {
    const response = await fetch(apiUrl + `?page=${page}&limit=${limit}`);
    const images = await response.json();

    grid.innerHTML = "";
    images.forEach((image, index) => {
      const tpl = elemById("image-container-template");
      const clonedContainer = tpl.content.cloneNode(true);

      const img = clonedContainer.querySelector("img.thumbnail");
      const rating = clonedContainer.querySelector(".rating");

      img.src = `https://picsum.photos/id/${image.id}/100/100`;
      img.addEventListener("click", () => openLightbox(image.download_url, images, index));

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
