import Image from './Image';

const searchForm = document.querySelector('.main__form form');
const imgGrid = document.querySelector('.img-grid');
const loadingAnimation = document.querySelector('.loading-animation');
const intersectionObserver = document.querySelector('.intersection-observer');

searchForm.addEventListener('submit', handleSearchSubmission);
imgGrid.addEventListener('click', handleImageClick);

let allImages = [];
let isNextAvailable = false;
let query;
let loading = false;

// Handle search query
async function handleSearchSubmission(e) {
  e.preventDefault();
  if (!e.target.image.value) return;
  query = e.target.image.value;

  toggleLoadingAnimation('start');
  Image.resetPage(); // Resetting page number for new query
  const queryResults = await Image.fetchImagesQuery(query);
  isNextAvailable = !!queryResults.next_page;
  toggleLoadingAnimation('end');
  const photos = appendImages(queryResults); // Results fed and photos instances are returned

  allImages = [...photos];
  console.log(allImages);
}

function handleImageClick(e) {
  const element = e.target;
  if (element.matches('img')) {
    const {
      dataset: { index },
    } = element;
    console.log(allImages[index]);
  }
}

// Handle infinte scroll
const ob = new IntersectionObserver(handleInfiniteScroll, {
  rootMargin: '50%',
  threshold: [0, 0.5, 1],
});
ob.observe(intersectionObserver);

async function handleInfiniteScroll(payload, observer) {
  if (!isNextAvailable || loading) return;
  // console.log(payload[0]);
  if (payload[0].intersectionRatio > 0.5) {
    console.log('YES!');
    console.log(payload[0]);
    const queryResults = await Image.fetchImagesQuery(query);
    isNextAvailable = !!queryResults.next_page;
    const photos = appendImages(queryResults); // Results fed and photos instances are returned

    allImages = [...allImages, ...photos];
  }
}

function appendImages(images) {
  if (images.photos.length) {
    const photos = images.photos.map((photo) => new Image(photo));
    const fragment = document.createDocumentFragment();
    photos.forEach((photo, index) => {
      fragment.append(photo.giveHtmlNode(index + allImages.length));
    });
    imgGrid.append(fragment);
    return photos;
  } else {
    const h4 = document.createElement('h4');
    h4.innerText = 'No results found';
    imgGrid.append(h4);
    return [];
  }
}

function toggleLoadingAnimation(state) {
  if (state === 'start') {
    imgGrid.innerHTML = '';
    loading = true;
  } else {
    loading = false;
  }
  loadingAnimation.classList.toggle('show');
}
