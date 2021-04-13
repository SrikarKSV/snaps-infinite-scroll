import Image from './Image';
import { handleImageClick, appendImages } from './imageGallery';
import { toggleBookmarkModal } from './bookmark';

const searchForm = document.querySelector('.main__form form');
const imgGrid = document.querySelector('.img-grid');
const loadingAnimation = document.querySelector('.loading-animation');
const intersectionObserver = document.querySelector('.intersection-observer');
const bookmarkMarkBtn = document.querySelector('.header__bookmark');
const bookmarkModal = document.querySelector('.bookmark');

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
imgGrid.addEventListener(
  'click',
  async (e) => await handleImageClick(e, allImages)
);
bookmarkMarkBtn.addEventListener('click', toggleBookmarkModal);

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
