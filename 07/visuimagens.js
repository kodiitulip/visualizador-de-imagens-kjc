const maxAmount = 100;
const limitPerPage = 20;

const apiUrl = "https://picsum.photos/v2/list";
const grid = document.querySelector(".container");

let allImages = []; // Armazena todas as imagens carregadas
let filteredImages = []; // Armazena as imagens filtradas
let currentPage = 1; // Página atual

/**
 * @param {string} id
 * @returns {( HTMLElement | null )} element
 */
const elemById = (id) => document.getElementById(id);

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

// Função para carregar as imagens na página atual
async function loadImages(page = 1, images = filteredImages) {
  try {
    const limit = limitPerPage;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const imagesToShow = images.slice(startIndex, endIndex);

    // Limpa completamente o grid antes de adicionar novas imagens
    grid.innerHTML = "";
    
    // Se não houver imagens para mostrar
    if (imagesToShow.length === 0) {
      const noResults = document.createElement('p');
      noResults.classList.add('no-results');
      noResults.textContent = "Nenhuma imagem encontrada com este autor.";
      grid.appendChild(noResults);
      return;
    }

    // Adiciona apenas as imagens filtradas
    for (const [index, image] of imagesToShow.entries()) {
      const tpl = elemById("image-container-template");
      const clonedContainer = tpl.content.cloneNode(true);

      const img = clonedContainer.querySelector("img.thumbnail");
      const rating = clonedContainer.querySelector(".rating");

      img.src = `https://picsum.photos/id/${image.id}/100/100`;
      img.addEventListener("click", () => openLightbox(image.download_url, images, startIndex + index));

      // Busca as informações da imagem e adiciona o tooltip
      try {
        const info = await fetchImageInfo(image.id);
        if (info) {
          addTooltip(img, info);
          // Armazena o nome do autor no data-attribute
          clonedContainer.querySelector(".image-container").dataset.author = info.author.toLowerCase();
        }
      } catch (error) {
        console.error("Erro ao buscar informações da imagem:", error);
      }

      rating.innerHTML = createStars(image.id);

      // Adiciona a classe de animação ao contêiner da imagem
      clonedContainer.querySelector(".image-container").classList.add("fade-in");

      grid.appendChild(clonedContainer);
      updateRatingDisplay(image.id);
    }
    
    // Adiciona verificação para debug
    console.log(`Exibindo ${imagesToShow.length} imagens na página ${page}`);
    
    // Verifica se as imagens mostradas correspondem às filtradas
    const containers = document.querySelectorAll('.image-container');
    console.log(`Número de containers na página: ${containers.length}`);
    
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

// Função para filtrar as imagens com base no autor
async function filterImages(authorName) {
  const searchTerm = authorName.toLowerCase().trim(); // Adiciona trim() para remover espaços extras
  
  // Se o campo de pesquisa estiver vazio, restaure todas as imagens
  if (searchTerm === "") {
    filteredImages = [...allImages]; // Cria uma cópia para evitar referência
    console.log("Pesquisa vazia, mostrando todas as imagens:", filteredImages.length);
  } else {
    // Filtra as imagens com base no autor
    filteredImages = allImages.filter((image) => {
      const author = image.author.toLowerCase();
      return author.includes(searchTerm);
    });
    console.log(`Filtro por "${searchTerm}" encontrou ${filteredImages.length} imagens`);
  }

  // Reset para a primeira página e atualiza interface
  currentPage = 1;
  
  // Primeiro carrega as imagens filtradas
  await loadImages(currentPage, filteredImages);
  
  // Depois atualiza a paginação
  populatePageContainer(filteredImages);
  
  // Atualiza visualmente a página atual
  const pageLinks = document.querySelectorAll('.page-link');
  pageLinks.forEach((link, index) => {
    link.classList.toggle('current', index === 0);
  });
}

// Modifique a função populatePageContainer
function populatePageContainer(images = allImages) {
  const pageAmount = Math.ceil(images.length / limitPerPage);
  const container = elemById("page-num-container");

  console.log("Total de imagens:", images.length);
  console.log("Imagens por página:", limitPerPage);
  console.log("Número de páginas:", pageAmount);

  container.innerHTML = "";

  // Caso não haja imagens para mostrar
  if (images.length === 0) {
    const noResults = document.createElement('span');
    noResults.textContent = "Nenhum resultado encontrado";
    noResults.classList.add('no-results');
    container.appendChild(noResults);
    
    // Limpa o grid de imagens
    grid.innerHTML = "<p class='no-results'>Nenhuma imagem encontrada com este autor.</p>";
    return;
  }

  for (let i = 1; i <= pageAmount; i++) {
    const tpl = elemById("page-link-template");
    const clonedLink = tpl.content.cloneNode(true);
    const span = clonedLink.querySelector(".page-link");
    
    span.innerHTML = i;
    span.addEventListener("click", () => {
      currentPage = i;
      loadImages(currentPage, images);
      
      // Atualiza visualmente a página atual
      const pageLinks = container.querySelectorAll('.page-link');
      pageLinks.forEach(link => link.classList.remove('current'));
      span.classList.add('current');
    });

    container.appendChild(clonedLink);
  }

  // Marca a página atual como atual
  const pageLinks = container.querySelectorAll('.page-link');
  if (pageLinks.length > 0) {
    pageLinks[currentPage - 1].classList.add('current');
  }
}

// Função para carregar todas as imagens da API
async function fetchAllImages(page = 1, limit = 20) {
  try {
    let allLoadedImages = [];
    let currentPage = page;
    
    while (allLoadedImages.length < maxAmount) {
      const response = await fetch(apiUrl + `?page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar as imagens");
      }
      const images = await response.json();
      
      // Se não receber mais imagens, pare
      if (images.length === 0) break;
      
      allLoadedImages = [...allLoadedImages, ...images];
      
      // Para se atingir o máximo de imagens
      if (allLoadedImages.length >= maxAmount) break;
      
      currentPage++;
    }

    // Limita o número de imagens ao valor de maxAmount
    allImages = allLoadedImages.slice(0, maxAmount);
    filteredImages = allImages; // Inicialmente, as imagens filtradas são iguais a todas as imagens

    console.log("Total de imagens carregadas:", allImages.length);

    // Atualiza a exibição das imagens e a paginação
    loadImages(currentPage, filteredImages);
    populatePageContainer(filteredImages);
  } catch (error) {
    console.error("Erro ao carregar as imagens:", error);
  }
}

// Funções de navegação de página também precisam ser atualizadas
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadImages(currentPage, filteredImages);
    
    // Atualiza visualmente a página atual
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach((link, index) => {
      link.classList.toggle('current', index === currentPage - 1);
    });
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredImages.length / limitPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    loadImages(currentPage, filteredImages);
    
    // Atualiza visualmente a página atual
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach((link, index) => {
      link.classList.toggle('current', index === currentPage - 1);
    });
  }
}

// Inicializa o carregamento das imagens
fetchAllImages(currentPage);