import Image from './Image';

const searchForm = document.querySelector('.main__form form');
const imgGrid = document.querySelector('.img-grid');
const loadingAnimation = document.querySelector('.loading-animation');

searchForm.addEventListener('submit', handleSearchSubmission);

let images = [];

async function handleSearchSubmission(e) {
  e.preventDefault();
  if (!e.target.image.value) return;
  const query = e.target.image.value;

  toggleLoadingAnimation('start');
  Image.resetPage(); // Resetting page number for new query
  const queryResults = await Image.fetchImagesQuery(query);
  toggleLoadingAnimation('end');
  const photos = appendImages(queryResults); // Results fed and photos instances are returned

  images = [...photos];
  console.log(images);
}

function appendImages(images) {
  if (images.photos.length) {
    const photos = images.photos.map((photo) => new Image(photo));
    const fragment = document.createDocumentFragment();
    photos.forEach((photo, index) => {
      fragment.append(photo.giveHtmlNode(index));
    });
    imgGrid.append(fragment);
    return photos;
  } else {
    const h4 = document.createElement('h4');
    h4.innerText = 'No results found';
    imgGrid.append(h4);
  }
}

function toggleLoadingAnimation(state) {
  state === 'start' ? (imgGrid.innerHTML = '') : null;
  loadingAnimation.classList.toggle('show');
}
