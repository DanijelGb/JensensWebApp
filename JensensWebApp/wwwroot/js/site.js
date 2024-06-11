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
  
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop('scroll-to-top');
  });
  