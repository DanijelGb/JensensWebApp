class ScrollToTop {
  constructor(buttonId) {
    this.button = document.getElementById(buttonId);
    this.init();
  }

  init() {
    document.addEventListener("scroll", () => this.onScroll());
    this.button.addEventListener('click', (event) => {
      event.preventDefault();
      this.scrollToTop();
    });
  }

  onScroll() {
    if (window.scrollY > 200) {
      this.button.classList.add("visible");
    } else {
      this.button.classList.remove("visible");
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


class CardLoader {
  constructor(allCardsSelector, cardsContainerId, loadMoreButtonId, cardsPerPage) { // Selects all the cards from the hidden div, at loading of the page
    this.allCards = document.querySelectorAll(allCardsSelector);                     // it appends the 10 first cards to the visible div.
    this.cardsContainer = document.getElementById(cardsContainerId);                 // Every time the button is clicked it runs the loadCards-function again to load 10 more.
    this.loadMoreButton = document.getElementById(loadMoreButtonId);
    this.cardsPerPage = cardsPerPage;
    this.currentIndex = 0;

    this.loadMoreButton.addEventListener("click", () => this.loadCards());
    this.loadCards();
  }

  loadCards() {
    for (let i = 0; i < this.cardsPerPage && this.currentIndex < this.allCards.length; i++) {
      this.cardsContainer.appendChild(this.allCards[this.currentIndex]);
      this.currentIndex++;
    }
    if (this.currentIndex >= this.allCards.length) { // When there's no more cards to load the button disappears.
      this.loadMoreButton.style.display = "none";
    }
  }

  reset() {
    this.cardsContainer.innerHTML = '';
    this.currentIndex = 0;
    this.loadMoreButton.style.display = "block";
    this.loadCards();
  }
}

class ArticleCounter{
  constructor(hiddenCardsSelector, displayedCardsSelector, filterButtonId, articleCountParagraphId) {
    this.hiddenCardsSelector = hiddenCardsSelector; // selects all hidden cards
    this.displayedCardsSelector = displayedCardsSelector; // selects all visible cards
    this.filterButton = document.getElementById(filterButtonId); // selects the filter button
    this.articleCountParagraph = document.getElementById(articleCountParagraphId); // selects the <p> element in which the article count will be displayed.

    this.filterButton.addEventListener("click", () => this.countArticles()); // calls the function when the filter button is pressed
    this.countArticles(); // calls the function when the class is instantiated
  }

  countArticles() {
    const hiddenCards = document.querySelectorAll(this.hiddenCardsSelector);
    const displayedCards = document.querySelectorAll(this.displayedCardsSelector);
    this.articleCountParagraph.innerText = (hiddenCards.length + displayedCards.length) + " articles found";
  }
}

class ArticleSearch {
    constructor(searchInputId, searchButtonId, cardLoader, articleCounter) {
        this.searchInput = document.getElementById(searchInputId);
        this.searchButton = document.getElementById(searchButtonId);
        this.cardLoader = cardLoader;
        this.articleCounter = articleCounter;

        this.searchButton.addEventListener("click", () => this.searchArticles());
    }

    searchArticles() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const allCards = document.querySelectorAll("#allCards .card-container");
        const filteredCards = [];

        allCards.forEach(card => {
            const title = card.querySelector(".card-title").textContent.toLowerCase();
            const summary = card.querySelector(".card-text").textContent.toLowerCase();
            if (title.includes(searchTerm) || summary.includes(searchTerm)) {
                filteredCards.push(card);
            }
        });

        this.cardLoader.allCards = filteredCards;
        this.cardLoader.reset();

        // Update article count text
      this.articleCounter.countArticles();
    }
  }

document.addEventListener('DOMContentLoaded', () => {
  new ScrollToTop('scroll-to-top');
  const cardLoader = new CardLoader("#allCards .card-container", "cards-container", "loadMoreButton", 10);
  const articleCounter = new ArticleCounter("#allCards .card-container", "#cards-container .card-container", "filter-button", "article-count-text");
  new ArticleSearch("searchInput", "searchButton", cardLoader, articleCounter);
});