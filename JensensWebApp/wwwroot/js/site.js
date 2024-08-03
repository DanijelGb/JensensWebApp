document.addEventListener("DOMContentLoaded", function() {
    class DropdownHandler {
        constructor() {
            this.selectTopicContainer = document.getElementById("select-topic-container");
            this.selectSortByContainer = document.getElementById("select-sort-container");
            this.selectTopic = document.getElementById("topic");
            this.selectSortBy = document.getElementById("sortBy");
            this.resetButton = document.getElementById("resetButton");
            this.displayedArticlesCount = document.getElementById("displayedArticlesCount");
            this.allCardContainers = document.querySelectorAll(".card-container");

            this.init();
        }

        addExpandedClass(container, select) {
            container.classList.add("expanded");
            select.classList.add("expanded");
        }

        removeExpandedClass(container, select) {
            container.classList.remove("expanded");
            select.classList.remove("expanded");
        }

        addMouseEvents(container, select) {
            container.addEventListener("mouseenter", () => this.addExpandedClass(container, select));
            container.addEventListener("mouseleave", () => this.removeExpandedClass(container, select));
        }

        handleFormSubmission() {
            const applyFilters = () => {
                const selectedTopic = this.selectTopic.value;
                const selectedSortBy = this.selectSortBy.value;
    
                const cardContainers = document.querySelectorAll(".card-container");
    
                let visibleCount = 0;
    
                cardContainers.forEach((container) => {
                    const articleTopic = container.dataset.topic;
    
                    if (selectedTopic === "" || articleTopic === selectedTopic) {
                        container.style.display = "flex"; 
                        visibleCount++;
                    } else {
                        container.style.display = "none";
                    }
                });
    
                if (selectedSortBy) {
                    const sortedContainers = Array.from(cardContainers).sort((a, b) => {
                        const dateA = new Date(a.querySelector(".card-text-muted small").textContent);
                        const dateB = new Date(b.querySelector(".card-text-muted small").textContent);
                        return selectedSortBy === "newest" ? dateB - dateA : dateA - dateB;
                    });
    
                    const parentContainer = document.querySelector("#cards-container");
                    parentContainer.innerHTML = "";
    
                    sortedContainers.forEach((container) => parentContainer.appendChild(container));
                }
    
                this.updateArticleCount(visibleCount);
            };
    
            this.selectTopic.addEventListener("change", applyFilters);
            this.selectSortBy.addEventListener("change", applyFilters);
        }

        handleOptionClicks() {
            const optionsTopic = document.querySelectorAll("#select-topic-container .dropdown-options a");
            const optionsSortBy = document.querySelectorAll("#select-sort-container .dropdown-options a");

            optionsTopic.forEach((option) => {
                option.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.selectTopic.value = option.getAttribute("data-value");
                    this.selectTopic.dispatchEvent(new Event("change"));
                });
            });

            optionsSortBy.forEach((option) => {
                option.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.selectSortBy.value = option.getAttribute("data-value");
                    this.selectSortBy.dispatchEvent(new Event("change"));
                });
            });
        }

        handleResetButton() {
            this.resetButton.addEventListener("click", () => {
                this.selectTopic.value = "";
                this.selectSortBy.value = "";
    
                this.allCardContainers.forEach(container => {
                    container.style.display = "flex"; 
                });
    
                this.updateArticleCount(this.allCardContainers.length);
            });
        }

        updateArticleCount(displayedCount) {
            const totalArticles = document.querySelectorAll("#allCards .card-container").length;
            this.displayedArticlesCount.innerText = displayedCount;
        }

        init() {
            this.addMouseEvents(this.selectTopicContainer, this.selectTopic);
            this.addMouseEvents(this.selectSortByContainer, this.selectSortBy);
            this.handleFormSubmission();
            this.handleOptionClicks();
            this.handleResetButton();
            this.updateArticleCount(document.querySelectorAll("#allCards .card-container").length);
        }
    }

    new DropdownHandler();
});

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
    constructor(allCardsSelector, cardsContainerId, loadMoreButtonId, cardsPerPage) {
        this.allCards = document.querySelectorAll(allCardsSelector);
        this.cardsContainer = document.getElementById(cardsContainerId);
        this.loadMoreButton = document.getElementById(loadMoreButtonId);
        this.cardsPerPage = cardsPerPage;
        this.currentIndex = 0;

        this.loadMoreButton.addEventListener("click", () => this.loadCards());
        this.loadCards();
    }

    loadCards() {
        let loadCount = 0;
        for (let i = 0; i < this.cardsPerPage && this.currentIndex < this.allCards.length; i++) {
            this.cardsContainer.appendChild(this.allCards[this.currentIndex]);
            this.currentIndex++;
            loadCount++;
        }
        if (this.currentIndex >= this.allCards.length) {
            this.loadMoreButton.style.display = "none";
        }
    }
}

class ArticleSummarizor{
  constructor (button, modalContent){
    this.url = button.nextElementSibling.href;              // gets the url related to the button clicked.
    this.title = button.parentElement.children[0].innerText // gets the title of said article
    this.modalContent = modalContent; 
    this.h3 = this.modalContent.children[0];                // selects the h3-element       
    this.p = this.modalContent.children[1];                 // selects the p-element
    this.summary = "";

    this.UpdateModal();                                     // runs the function for updating modal-content.
  }

  async UpdateModal() {
    this.h3.innerText = this.title;
    this.p.innerText = await this.Summarize();              // Runs the function for sending a request to the api
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
}

class ModalOpener {
    constructor(){
    this.modal = document.getElementById("summary-modal");        // Adds listeners to all the summarize-buttons. Also adds listener to the close-button.
    this.btns = document.querySelectorAll(".summarizeBtn");       // The class handles opening and closing of the modal. You can close it by either
    this.span = document.getElementsByClassName("closeBtn")[0];   // clicking the button or anywhere on the screen outside of the modal.
    this.modalContent = this.modal.querySelector(".modal-content");

    this.init();
    }

    init() {
      this.btns.forEach(button => {
        console.log(button);
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
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop('scroll-to-top');
    new CardLoader("#allCards .card-container", "cards-container", "loadMoreButton", 10);
    console.log("loading...");
    new ModalOpener();
});