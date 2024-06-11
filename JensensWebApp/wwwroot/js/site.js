class CardLoader {
  constructor (allCardsSelector, cardsContainerId, loadMoreButtonId, cardsPerPage) {
    this.allCards = document.querySelectorAll(allCardsSelector);
    this.cardsContainer = document.getElementById(cardsContainerId);
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
    if(this.currentIndex >= this.allCards.length) {
      this.loadMoreButton.style.display = "block";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CardLoader("#allCards .card-container", "cards-container", "loadMoreButton", 10);
});