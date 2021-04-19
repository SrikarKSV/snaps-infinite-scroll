import Image from './Image';
import {
  handleImageClick,
  appendImages,
  fetchQueryControl,
} from './imageGallery';
import { toggleBookmarkModal } from './bookmark';

const searchForm = document.querySelector('.main__form form');
const imgGrid = document.querySelector('.img-grid');
const loadingAnimation = document.querySelector('.loading-animation');
const intersectionObserver = document.querySelector('.intersection-observer');
const bookmarkMarkBtn = document.querySelector('.header__bookmark');
const queryControlContainer = document.querySelector('.query-controls');
const queryControlForm = document.querySelector('.query-controls__form');

// State variables
let allImages = [];
let isNextAvailable = false;
let query;
let loading = false;
let isColorPickerChanged = false;

// Load curated images when DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
  // Enabling dark or light mode
  const mode = JSON.parse(localStorage.getItem('mode'));
  mode === 'light' ? document.body.classList.add('light-mode') : null;

  // Loading curated images
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
  document.body.classList.toggle('light-mode');
  const isLightMode = document.body.classList.contains('light-mode');
  const mode = isLightMode ? 'light' : 'dark';
  localStorage.setItem('mode', JSON.stringify(mode));
}

// Callbacks

// Handle search query
async function handleSearchSubmission(e) {
  e.preventDefault();
  if (!e.target.image.value) return;
  query = e.target.image.value;
  fetchAndAppendImages();
  // Toggle query controls
  queryControlContainer.classList.add('show');
}

// Handle query controls
const colorPicker = document.querySelector('#color');
const formResetBtn = document.querySelector('.query-controls__reset');

queryControlForm.addEventListener('change', fetchAndAppendImages);
formResetBtn.addEventListener('click', handleQueryControlReset);
colorPicker.addEventListener('change', () => (isColorPickerChanged = true));

async function handleQueryControlReset() {
  isColorPickerChanged = false;
  queryControlForm.reset();

  fetchAndAppendImages();
}

// Handle infinte scroll
const observer = new IntersectionObserver(handleInfiniteScroll, {
  rootMargin: '70%',
  threshold: [0, 0.5, 1],
});

observer.observe(intersectionObserver);

async function handleInfiniteScroll(payload) {
  if (!isNextAvailable || loading) return;

  if (payload[0].intersectionRatio > 0.5) {
    const queryResults = await fetchQueryControl(
      query,
      isColorPickerChanged,
      false
    );
    isNextAvailable = !!queryResults.next_page;
    const photos = appendImages(queryResults, imgGrid, allImages); // Results fed and photos instances are returned

    allImages = [...allImages, ...photos];
  }
}

async function fetchAndAppendImages() {
  // Emptying allImages to set index on dataset of image
  allImages = [];
  toggleLoadingAnimation('start');
  const queryResults = await fetchQueryControl(
    query,
    isColorPickerChanged,
    true
  );
  // Observer won't run is next page not available
  isNextAvailable = !!queryResults.next_page;
  toggleLoadingAnimation('end');
  const photos = appendImages(queryResults, imgGrid, allImages); // Results fed and photos instances are returned
  allImages = [...photos];
}

// Loading animations
function toggleLoadingAnimation(state) {
  state === 'start' ? (imgGrid.innerHTML = '') : null;
  loading = !loading;
  loadingAnimation.classList.toggle('show');
}
