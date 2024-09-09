const apiUrl = "https://picsum.photos/v2/list?page=2&limit=20";
const grid = document.querySelector(".container");

// function to get a substring until found a substring
function getStringUntil(str, substr) {
    const step = substr.length;
    for (let count = 0; count < str.length; count++) {
        let substring = str.substring(count, count + step);
        if (substring === substr) {
            return str.substring(0, count + step);
        }
    }
    return null;
}
//cortar a string do images.download_url na altura do Id "https://picsum.photos/id/103/2592/1936"

// alert(getStrUntil("https://picsum.photos/id/103/2592/1936","id"));

function getStrUntil(str, substring) {
    const regex = new RegExp(`.*(?<=${substring})`, "g"); // Expressao: /.*(?<=id)/g

    /** 
        Descricao da Expressao Regular /.*(?<=id)/g
        
        / ... / - Inicio e fim da expressao
        g - Modo global,retorna todos os "match" encontrado 
        . - "match" com qualquer caractere na string, exceto o caractere de final de linha
        * - repete a busca quantas vezes for necessario 
        (?<=id) - nome do grupo: procura a sequencia até encontrar a palavra "id" 

        Sempre uso o site https://regex101.com/ para construir e testar as expressoes que preciso
            
    */

    let result = str.match(regex); //busca por um"match" e retorna um array com os resultados

    return result[0];

}

function createStars(id) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star" data-id="${id}" data-rating="${i}" onclick="rateImage(${id}, ${i})">&#9734;</span>`;
    }
    return stars;
}

function rateImage(id, rating) {
    localStorage.setItem(id, rating);
    loadRating(id);
}

function loadRating(id) {
    const rating = localStorage.getItem(id);
    if (rating) {
        const stars = document.querySelectorAll(`.star[data-id="${id}"]`);
        stars.forEach((star, index) => {
            if (index < rating) {
                star.innerHTML = "&#9733;";
            } else {
                star.innerHTML = "&#9734;";
            }
        });
    }
}

function openLightbox(url) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    lightboxImage.src = url;
    lightbox.style.display = "flex";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";
}


fetch(apiUrl).then(response => response.json()).then(images => {
    images.forEach(image => {
        const div = document.createElement("div");


        div.innerHTML = `
                <img src="https://picsum.photos/id/${image.id}/100/100" class="thumbnail" onclick="openLightbox('${image.download_url}')"/>
                <div>${createStars(image.id)}</div>
            `;
        grid.appendChild(div);
        loadRating(image.id);
    });
});
