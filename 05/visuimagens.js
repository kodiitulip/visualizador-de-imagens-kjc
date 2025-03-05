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

let db;

// Abre ou cria o banco de dados "RatingsDB" com versão 1
const request = indexedDB.open("RatingsDB", 1);

request.onerror = (event) => {
  console.error("Erro ao abrir o banco de dados:", event.target.error);
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Banco de dados aberto com sucesso.");
  loadRatings(); // Carrega os ratings ao iniciar a página
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  // Cria um objeto de armazenamento chamado "ratings" com "id" como chave primária
  if (!db.objectStoreNames.contains("ratings")) {
    db.createObjectStore("ratings", { keyPath: "id" });
    console.log("Objeto de armazenamento 'ratings' criado.");
  }
};

// Função para salvar a avaliação no IndexedDB
async function saveRating(id, rating) {
  try {
    const transaction = db.transaction("ratings", "readwrite");
    const store = transaction.objectStore("ratings");
    await store.put({ id, rating });
    console.log(`Rating salvo para a imagem ${id}: ${rating}`);
  } catch (error) {
    console.error("Erro ao salvar rating no IndexedDB:", error);
  }
}

// Função para carregar todas as avaliações do IndexedDB
async function loadRatings() {
  try {
    const transaction = db.transaction("ratings", "readonly");
    const store = transaction.objectStore("ratings");
    const request = store.getAll();

    request.onsuccess = (event) => {
      const ratings = event.target.result;
      ratings.forEach((rating) => {
        updateRatingDisplay(rating.id);
      });
      console.log("Ratings carregados com sucesso.");
    };

    request.onerror = (event) => {
      console.error("Erro ao carregar ratings:", event.target.error);
    };
  } catch (error) {
    console.error("Erro ao carregar ratings:", error);
  }
}

// Função para atualizar a exibição das estrelas com base na avaliação salva
async function updateRatingDisplay(id) {
  try {
    const transaction = db.transaction("ratings", "readonly");
    const store = transaction.objectStore("ratings");
    const request = store.get(id);

    request.onsuccess = (event) => {
      const rating = event.target.result;
      if (rating) {
        const stars = document.querySelectorAll(`.star[data-id="${id}"]`);
        stars.forEach((star, index) => {
          star.innerHTML = index < rating.rating ? "&#9733;" : "&#9734;";
        });
      }
    };

    request.onerror = (event) => {
      console.error("Erro ao buscar rating:", event.target.error);
    };
  } catch (error) {
    console.error("Erro ao atualizar exibição do rating:", error);
  }
}

// Função para avaliar uma imagem e salvar a avaliação no IndexedDB
function rateImage(id, rating) {
  saveRating(id, rating); // Salva no IndexedDB
  updateRatingDisplay(id); // Atualiza a exibição das estrelas
}

let currentSlide = 0;
let slidesContainer;

async function openLightbox(url, images, index) {
  try {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) {
      throw new Error("Elemento lightbox não encontrado.");
    }

    const carousel = lightbox.querySelector(".carousel");
    if (!carousel) {
      throw new Error("Elemento carousel não encontrado.");
    }

    const slidesContainer = carousel.querySelector(".slides");
    if (!slidesContainer) {
      throw new Error("Elemento slidesContainer não encontrado.");
    }

    // Limpa o carrossel antes de adicionar novas imagens
    slidesContainer.innerHTML = "";

    // Verifica se o array de imagens está definido
    if (!images || !Array.isArray(images)) {
      throw new Error("Array de imagens não definido ou inválido.");
    }

    // Adiciona as imagens ao carrossel
    for (const [i, image] of images.entries()) {
      const slide = document.createElement("div");
      slide.classList.add("slide");

      const img = document.createElement("img");
      img.src = `https://picsum.photos/id/${image.id}/800/600`;
      img.alt = `Imagem de ${image.author}`;
      img.classList.add("carousel-image");

      slide.appendChild(img);
      slidesContainer.appendChild(slide);
    }

    // Exibe o slide correspondente à imagem clicada
    currentSlide = index;
    showSlide(currentSlide);

    // Exibe o modal
    lightbox.style.display = "flex";
  } catch (error) {
    console.error("Erro ao abrir o lightbox:", error);
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
}

function showSlide(index) {
  const slides = document.querySelectorAll(".slide");

  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }

  const slidesContainer = document.querySelector(".slides");
  if (slidesContainer) {
    const offset = -currentSlide * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;
  } else {
    console.error("Elemento slidesContainer não encontrado.");
  }
}

function nextSlide(event) {
  event.stopPropagation(); // Impede a propagação do evento
  showSlide(currentSlide + 1);
}

function prevSlide(event) {
  event.stopPropagation(); // Impede a propagação do evento
  showSlide(currentSlide - 1);
}

async function loadImages(page = 1, limit = 20) {
  try {
    const response = await fetch(apiUrl + `?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Erro ao carregar as imagens");
    }
    const images = await response.json();

    grid.innerHTML = "";
    for (const [index, image] of images.entries()) {
      const tpl = elemById("image-container-template");
      const clonedContainer = tpl.content.cloneNode(true);

      const img = clonedContainer.querySelector("img.thumbnail");
      const rating = clonedContainer.querySelector(".rating");

      img.src = `https://picsum.photos/id/${image.id}/100/100`;
      img.addEventListener("click", () => openLightbox(image.download_url, images, index));

      // Busca as informações da imagem e adiciona o tooltip
      try {
        const info = await fetchImageInfo(image.id);
        if (info) {
          addTooltip(img, info);
        }
      } catch (error) {
        console.error("Erro ao buscar informações da imagem:", error);
      }

      rating.innerHTML = createStars(image.id);

      grid.appendChild(clonedContainer);
      updateRatingDisplay(image.id);
    }

    populatePageContainer();
  } catch (error) {
    console.error("Erro ao carregar as imagens:", error);
  }
}

// Função para buscar detalhes da imagem
async function fetchImageInfo(id) {
  try {
    const response = await fetch(`https://picsum.photos/id/${id}/info`);
    if (!response.ok) {
      throw new Error("Erro ao buscar informações da imagem");
    }
    const info = await response.json();
    return info;
  } catch (error) {
    console.error("Erro ao buscar informações da imagem:", error);
    return null;
  }
}

// Função para adicionar um tooltip à thumbnail
function addTooltip(imageElement, info) {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.innerText = `Autor: ${info.author}\nDimensões: ${info.width} x ${info.height}`;

  // Posiciona o tooltip próximo da imagem
  imageElement.parentElement.appendChild(tooltip);

  // Eventos para exibir e ocultar o tooltip
  imageElement.addEventListener("mouseover", () => {
    tooltip.style.display = "block";
  });

  imageElement.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
  });
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
