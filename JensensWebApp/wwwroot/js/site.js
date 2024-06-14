document.addEventListener("DOMContentLoaded", function() {
    class DropdownHandler {
        constructor() {
            this.selectTopicContainer = document.getElementById("select-topic-container");
            this.selectSortByContainer = document.getElementById("select-sort-container");
            this.selectTopic = document.getElementById("topic");
            this.selectSortBy = document.getElementById("sortBy");
            this.resetButton = document.getElementById("resetButton");
            this.displayedArticlesCount = document.getElementById("displayedArticlesCount");
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
                        container.style.display = "block";
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

                const cardContainers = document.querySelectorAll(".card-container");
                cardContainers.forEach((container) => {
                    container.style.display = "block";
                });

                this.updateArticleCount(cardContainers.length);
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
        this.updateArticleCount();
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
        this.updateArticleCount();
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop('scroll-to-top');
    new CardLoader("#allCards .card-container", "cards-container", "loadMoreButton", 10);
});
