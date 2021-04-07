import Image from './Image';

const searchForm = document.querySelector('.main__form form');
const imgGrid = document.querySelector('.img-grid');

searchForm.addEventListener('submit', handleSearchSubmission);

let images = [];

async function handleSearchSubmission(e) {
  e.preventDefault();
  if (!e.target.image.value) return;
  const query = e.target.image.value;

  const queryResults = await Image.fetchImagesQuery(query);
  const photos = queryResults.photos.map((photo) => new Image(photo));
  const fragment = document.createDocumentFragment();
  photos.forEach((photo, index) => {
    fragment.append(photo.giveHtmlNode(index));
  });

  imgGrid.append(fragment);

  images = [...images, ...photos];
  console.log(images);
}
