﻿class CardLoader {
  constructor (allCardsSelector, cardsContainerId, loadMoreButtonId, cardsPerPage) { // Selects all the cards from the hidden div, at loading of the page
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
    if(this.currentIndex >= this.allCards.length) { // When there's no more cards to load the button disappears.
      this.loadMoreButton.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CardLoader("#allCards .card-container", "cards-container", "loadMoreButton", 10); // Creates an instance of the class when the dom content has loaded.
});