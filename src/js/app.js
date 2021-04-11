import Image from './Image';
import { handleImageClick, appendImages } from './imageGallery';
import { loadModalData, handleModalBtns } from './modal';

const searchForm = document.querySelector('.main__form form');
const imgGrid = document.querySelector('.img-grid');
const loadingAnimation = document.querySelector('.loading-animation');
const intersectionObserver = document.querySelector('.intersection-observer');
const modalBtns = document.querySelectorAll('.modal__inner button');

// State variables
let allImages = [];
let isNextAvailable = false;
let query;
let loading = false;

// Load curated images when DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
  toggleLoadingAnimation('start');
  const queryResults = await Image.fetchImages();
  isNextAvailable = !!queryResults.next_page;
  toggleLoadingAnimation('end');
  const photos = appendImages(queryResults, imgGrid, allImages); // Results fed and photos instances are returned
  allImages = [...photos];
});

// Event listeners
searchForm.addEventListener('submit', handleSearchSubmission);
imgGrid.addEventListener('click', (e) => handleImageClick(e, allImages));
modalBtns.forEach((btn) =>
  btn.addEventListener('click', (e) => handleModalBtns(e, allImages))
);

// Dark mode
const darkModeBtn = document.querySelector('.header__darkmode');
darkModeBtn.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Callbacks

// Handle search query
async function handleSearchSubmission(e) {
  e.preventDefault();
  if (!e.target.image.value) return;
  query = e.target.image.value;
  allImages = [];

  toggleLoadingAnimation('start');
  Image.resetPage(); // Resetting page number for new query
  const queryResults = await Image.fetchImages(query);
  isNextAvailable = !!queryResults.next_page;
  toggleLoadingAnimation('end');
  const photos = appendImages(queryResults, imgGrid, allImages); // Results fed and photos instances are returned
  allImages = [...photos];
  console.log(allImages);
}

// Handle infinte scroll
const observer = new IntersectionObserver(handleInfiniteScroll, {
  rootMargin: '60%',
  threshold: [0, 0.5, 1],
});

observer.observe(intersectionObserver);

async function handleInfiniteScroll(payload, observer) {
  if (!isNextAvailable || loading) return;

  if (payload[0].intersectionRatio > 0.5) {
    const queryResults = await Image.fetchImages(query);
    isNextAvailable = !!queryResults.next_page;
    const photos = appendImages(queryResults, imgGrid, allImages); // Results fed and photos instances are returned

    allImages = [...allImages, ...photos];
  }
}

// Loading animations
function toggleLoadingAnimation(state) {
  state === 'start' ? (imgGrid.innerHTML = '') : null;
  loading = !loading;
  loadingAnimation.classList.toggle('show');
}

// Keyboard shortcuts
const modal = document.querySelector('.modal');
const modalInner = document.querySelector('.modal__inner');

window.addEventListener('keyup', handleKeyboard);

function handleKeyboard(e) {
  // Switch images in modal
  if (modal.classList.contains('show')) {
    let modalIndex = parseInt(modalInner.dataset.index);
    switch (e.key) {
      case 'ArrowLeft':
        loadModalData(modalIndex, allImages, 'left');
        break;
      case 'ArrowRight':
        loadModalData(modalIndex, allImages, 'right');
        break;
    }
  }
  if (e.key === 'Escape') {
    modal.classList.remove('show');
  }
}
