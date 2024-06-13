document.addEventListener("DOMContentLoaded", function() {
    var selectTopicContainer = document.getElementById("select-topic-container");
    var selectSortByContainer = document.getElementById("select-sort-container");
    var selectTopic = document.getElementById("topic");
    var selectSortBy = document.getElementById("sortBy");

    // Function to add expanded class
    function addExpandedClass(container, select) {
        container.classList.add("expanded");
        select.classList.add("expanded");
    }

    // Function to remove expanded class
    function removeExpandedClass(container, select) {
        container.classList.remove("expanded");
        select.classList.remove("expanded");
    }

    // Event listeners for mouseenter and mouseleave
    selectTopicContainer.addEventListener("mouseenter", function() {
        addExpandedClass(selectTopicContainer, selectTopic);
    });

    selectTopicContainer.addEventListener("mouseleave", function() {
        removeExpandedClass(selectTopicContainer, selectTopic);
    });

    selectSortByContainer.addEventListener("mouseenter", function() {
        addExpandedClass(selectSortByContainer, selectSortBy);
    });

    selectSortByContainer.addEventListener("mouseleave", function() {
        removeExpandedClass(selectSortByContainer, selectSortBy);
    });

    // Event listener for form submission (filtering and sorting)
    document.getElementById("filterForm").addEventListener("submit", function(event) {
        event.preventDefault(); 

        // Get selected values
        var selectedTopic = selectTopic.value;
        var selectedSortBy = selectSortBy.value;

        // Filter and sort articles
        var cardContainers = document.querySelectorAll(".card-container");

        cardContainers.forEach(function(container) {
            var articleTopic = container.dataset.topic;

            // Check if the article matches the selected topic filter
            if (selectedTopic === "" || articleTopic === selectedTopic) {
                container.style.display = "block"; 
            } else {
                container.style.display = "none"; 
            }
        });

        // Sort articles based on selected sorting option (if any)
        if (selectedSortBy === "newest") {
            var sortedContainers = Array.from(cardContainers).sort(function(a, b) {
                var dateA = new Date(a.querySelector(".card-text-muted small").textContent);
                var dateB = new Date(b.querySelector(".card-text-muted small").textContent);
                return dateB - dateA; 
            });

            // Append sorted containers back to the parent
            var parentContainer = document.querySelector(".cards-container");
            parentContainer.innerHTML = ""; 

            sortedContainers.forEach(function(container) {
                parentContainer.appendChild(container); 
            });
        } else if (selectedSortBy === "oldest") {
            var sortedContainers = Array.from(cardContainers).sort(function(a, b) {
                var dateA = new Date(a.querySelector(".card-text-muted small").textContent);
                var dateB = new Date(b.querySelector(".card-text-muted small").textContent);
                return dateA - dateB; 
            });

            // Append sorted containers back to the parent
            var parentContainer = document.querySelector(".cards-container");
            parentContainer.innerHTML = "";

            sortedContainers.forEach(function(container) {
                parentContainer.appendChild(container);
            });
        }
    });

    // Event listeners for option clicks (for dropdown options)
    var optionsTopic = document.querySelectorAll("#select-topic-container .dropdown-options a");
    var optionsSortBy = document.querySelectorAll("#select-sort-container .dropdown-options a");

    optionsTopic.forEach(function(option) {
        option.addEventListener("click", function(event) {
            event.preventDefault();
            selectTopic.value = option.getAttribute("data-value");
            document.getElementById("filterForm").dispatchEvent(new Event("submit"));
        });
    });

    optionsSortBy.forEach(function(option) {
        option.addEventListener("click", function(event) {
            event.preventDefault();
            selectSortBy.value = option.getAttribute("data-value");
            document.getElementById("filterForm").dispatchEvent(new Event("submit"));
        });
    });
});
