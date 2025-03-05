# Trabalho Teórico-Prático da Disciplina de Autoração Multimídia II

## Informações do Curso e Equipe

- **Universidade:** Universidade Federal do Ceará
- **Curso:** Bacharelado em Sistemas e Mídias Digitais
- **Disciplina:** Autoração Multimídia II
- **Professor:** Wellington Wagner Ferreira Sarmento
- **Equipe:** KJC
- **Integrantes:**
  - **K**odie Freitas Sales - Matrícula: 561525
  - **J**acó Pinto Farias Mota Filho - Matrícula: 389775
  - **C**lara Lívia Moura de Oliveira - Matrícula: 554010

---

## Questão 1: Paginação de Imagens

### **Problema**

Como exibir 100 imagens divididas em páginas de 20 imagens cada?

### **Tarefa**

Modifique o [código](https://github.com/wwagner33/visualizador-de-imagens) (ver acima “visualizador-de-imagens”) para buscar 100 imagens e implementar um sistema de paginação.Vocês devem criar botões “Próxima” e “Anterior” que, ao serem clicados, atualizam o grid com as imagens correspondentes.

## Explicação

A ideia aqui é aprimorar a experiência do usuário, permitindo que ele navegue por um conjunto grande de imagens sem sobrecarregar a página. Para isso, usamos a técnica de paginação. Em vez de exibir todas as 100 imagens de uma vez, você busca apenas um "pedaço" (20 imagens) por vez. Assim, o carregamento fica mais rápido e a interface mais organizada.

### Código

- Veja o código: [Questão 01 - HTML](./01/index.html)
  [Questão 01 - CSS](./01/visuimagens.css)
  [Questão 01 - JS](./01/visuimagens.js)

---

## Questão 2: Transformando a Visualização em Carrossel

### **Problema**

Como converter a visualização de imagens (atualmente com ***lightbox***) para um formato de carrossel?

### **Tarefa**

Utilize uma biblioteca de **carrossel** (como [**Slick**](https://kenwheeler.github.io/slick/)) ou crie uma lógica simples que permita a navegação entre imagens em um “**slider**”.

### **Explicação**

O carrossel oferece uma experiência interativa onde o usuário pode navegar pelas imagens deslizando para os lados.

### Código

- Veja o código: [Questão 02 - HTML](./02/index.html)
  [Questão 02 - CSS](./02/visuimagens.css)
  [Questão 02 - JS](./02/visuimagens.js)

---

## Questão 3: Persistência do Rating com IndexedDB

### **Problema**

Como salvar a avaliação das imagens (*rating*) usando **IndexedDB** em vez de **localStorage**?

### **Tarefa**

Implemente uma solução que crie um banco de dados no navegador, armazene os *ratings* e recupere-os na inicialização da página.

### **Explicação**

O **IndexedDB** é uma **API** de armazenamento mais robusta que o **localStorage**, permitindo o armazenamento de dados estruturados e transações assíncronas. Essa abordagem é ideal quando você precisa gerenciar dados mais complexos e de maior volume.

### Código

- Veja o código: [Questão 03 - HTML](./03/index.html)
  [Questão 03 - CSS](./03/visuimagens.css)
  [Questão 03 - JS](./03/visuimagens.js)

---

## Questão 4: Tooltip com Informações da Imagem

### **Problema**

Como inserir um [**tooltip**](https://pt.wikipedia.org/wiki/Dica_de_ferramenta) nas [**thumbnails**](https://pt.wikipedia.org/wiki/Thumbnail) que exiba o autor da imagem e suas dimensões originais?

### **Tarefa**

Utilize a **API** do [**Lorem Picsum**](https://picsum.photos/) para obter detalhes de cada imagem e, em seguida, adicione um [**tooltip**](https://pt.wikipedia.org/wiki/Dica_de_ferramenta) (com **CSS** e **JavaScript**) que apareça ao passar o mouse.

### **Explicação**

A ideia é melhorar a experiência do usuário oferecendo informações adicionais sem poluir a interface. Ao passar o mouse sobre uma imagem, um **tooltip** aparece mostrando detalhes como o autor e o tamanho original da imagem. Isso envolve uma nova chamada à **API** para obter os dados detalhados da imagem.

### Código

- Veja o código: [Questão 04 - HTML](./04/index.html)
  [Questão 04 - CSS](./04/visuimagens.css)
  [Questão 04 - JS](./04/visuimagens.js)

---

## Questão 5: Reforçando o Uso de Async Functions

### **Problema**

Como garantir que todas as operações assíncronas do código sejam tratadas corretamente?

### **Tarefa**

Peça aos alunos que refatorarem o código de carregamento das imagens (e de outras operações, como a busca de detalhes) para usar funções `async/await`, combinadas com `try...catch()` para tratamento de erros.

### **Explicação**

Às vezes, a complexidade das operações assíncronas pode deixar o código confuso e suscetível a erros. Refatorar funções para usar `async/await` torna o fluxo do código mais linear e fácil de entender, além de facilitar o tratamento de erros com blocos `try...catch().`

### Código

- Veja o código: [Questão 05 - HTML](./05/index.html)
  [Questão 05 - CSS](./05/visuimagens.css)
  [Questão 05 - JS](./05/visuimagens.js)

---

## Questão 6: Animações com element.classList.add()

### **Problema**

Como aplicar animações ou efeitos de transição ao carregar as imagens?

### **Tarefa**

Utilize o método `element.classList.add()` para adicionar classes que ativem **transições CSS** (por exemplo, fade-in ou slide-in) quando as imagens forem inseridas no grid.

### **Explicação**

Adicionar efeitos visuais melhora a experiência do usuário e dá um toque de modernidade à interface. Ao usar `element.classList.add()`, você pode dinamicamente aplicar classes que definem animações **CSS** (como **fade-in** ou **slide-in**), tornando a inserção de imagens mais suave e agradável.

### Código

- Veja o código: [Questão 06 - HTML](./06/index.html)
  [Questão 06 - CSS](./06/visuimagens.css)
  [Questão 06 - JS](./06/visuimagens.js)

  ---

## Questão 7: Implementando Filtros de Busca

### **Problema:**

Como permitir que o usuário filtre as imagens por autor?

### **Tarefa**

Implemente um campo de pesquisa que, ao receber o nome do autor, filtre as imagens exibidas no grid.

### **Explicação**

Implementar filtros melhora a usabilidade, permitindo que os usuários encontrem rapidamente o que procuram. Neste caso, a busca por autor pode ser feita utilizando atributos de dados (d**ata-attributes**) ou integrando a lógica de filtragem com os dados retornados pela **API**.

### Código

- Veja o código: [Questão 07 - HTML](./07/index.html)
  [Questão 07 - CSS](./07/visuimagens.css)
  [Questão 07 - JS](./07/visuimagens.js)