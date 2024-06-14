﻿class ScrollToTop {
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
}

class ArticleCounter{
  constructor(hiddenCardsSelector, displayedCardsSelector, filterButtonId, articleCountParagraphId) {
    this.hiddenCards = document.querySelectorAll(hiddenCardsSelector); // selects all hidden cards
    this.displayedCards = document.querySelectorAll(displayedCardsSelector); // selects all visible cards
    this.filterButton = document.getElementById(filterButtonId); // selects the filter button
    this.articleCountParagraph = document.getElementById(articleCountParagraphId); // selects the <p> element in which the article count will be displayed.

    this.filterButton.addEventListener("click", () => this.countArticles()); // calls the function when the filter button is pressed
    this.countArticles(); // calls the function when the class is instantiated
  }

  countArticles() {
    this.articleCountParagraph.innerText = (this.hiddenCards.length + this.displayedCards.length) + " articles found"; // adds the count of hidden and visibile cards
  }                                                                                                                    // and assign the result to the <p>-element

}

class ArticleSummarizor{
  constructor (button, modalContent){
    this.url = button.nextElementSibling.href;              // gets the url related to the button clicked.
    this.title = button.parentElement.children[0].innerText // gets the title of said article
    this.modalContent = modalContent; 
    this.h3 = this.modalContent.children[0];                // selects the h3-element       
    this.p = this.modalContent.children[1];                 // selects the p-element
    this.loader = document.getElementsByClassName("loader")[0];
    this.summary = "";

    this.UpdateModal();                                     // runs the function for updating modal-content.
  }

  async UpdateModal() {
    this.h3.innerText = this.title;
    this.p.innerText = this.FormatSummary(await this.Summarize());              // Runs the function for sending a request to the api
    this.loader.style.display = "none";
    this.h3.style.display = "block";
    this.p.style.display = "block";
  }

  async Summarize() {                                       // running asynchronously so the program waits for the fetch to complete. 
    const formdata = new FormData();
    formdata.append("key", "51c166ec7dcc88cb16db8eb5489dbf95");   // User-key needed to communicate with the api, there is a cost for each word and a limit on how many free ones you get each month.
    formdata.append("url", this.url);                             // The url that should get summarized
    formdata.append("sentences", 5);                              // number of sentences in summary.

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    return fetch("https://api.meaningcloud.com/summarization-1.0", requestOptions)  // API url
      .then(response => (
         response.json()
      ))
      .then(data => {
        return data.summary                                     // returns the summary-property of the response.json
      })
      .catch(error => console.log("error", error));
  }

  FormatSummary(summary) {
    const reg = /(\shttps?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)/;
    return summary.replace(reg, "");
  }
}

class ModalOpener {
    constructor(){
    this.modal = document.getElementById("summary-modal");        // Adds listeners to all the summarize-buttons. Also adds listener to the close-button.
    this.btns = document.querySelectorAll(".summarizeBtn");       // The class handles opening and closing of the modal. You can close it by either
    this.span = document.getElementsByClassName("closeBtn")[0];   // clicking the button or anywhere on the screen outside of the modal.
    this.modalContent = this.modal.querySelector(".modal-content");
    this.loader = document.getElementsByClassName("loader")[0];
    this.h3 = this.modalContent.children[0];                // selects the h3-element       
    this.p = this.modalContent.children[1];                 // selects the p-element

    this.init();
    }

    init() {
      this.btns.forEach(button => {
        button.addEventListener("click", (event) => {   // Adds listener to all buttons that should open the modal.
          event.stopPropagation();
          new ArticleSummarizor(button, this.modalContent);
          this.OpenModal();
        });
      });
      
      this.span.addEventListener("click", (event) => {
        event.stopPropagation();
        this.CloseModal();
      });

      document.addEventListener("click", (event) => {
        if(this.modal.style.display === "block" && !this.modalContent.contains(event.target) && event.target !== this.modal) {  // enables closing the modal when clicking on the screen
          event.stopPropagation();
          this.CloseModal();
        }
      });

      this.modalContent.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    OpenModal() {
        this.modal.style.display = "block";
    };

    CloseModal() {
        this.modal.style.display = "none";
        this.h3.style.display = "none";
        this.p.style.display = "none";
        this.loader.style.display = "block";
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollToTop('scroll-to-top');
  new CardLoader("#allCards .card-container", "cards-container", "loadMoreButton", 10); // Creates an instance of the class when the dom content has loaded.
  new ArticleCounter("#allCards .card-container", "#cards-container .card-container", "filter-button", "article-count-text"); // Creates an instance of the class when the dom content has loaded.
  new ModalOpener();
});