import Image from './Image';
import Modal from './Modal';

const modal = document.querySelector('.modal');
const form = document.querySelector('.query-controls__form');

export async function fetchQueryControl(
  query,
  isColorPickerChanged,
  shouldPageReset
) {
  const orientation = form.orientation.value;
  const color = form.color.value;
  const params = {
    orientation,
    color,
  };
  if (!isColorPickerChanged) delete params.color;
  // Will reset page number (not for observer)
  shouldPageReset ? Image.resetPage() : null;
  const images = await Image.fetchImages(query, params);
  return images;
}

export async function handleImageClick(event, allImages) {
  const element = event.target;
  if (element.matches('img')) {
    const {
      dataset: { index },
    } = element;
    const imgGalleryModal = new Modal(modal, allImages, index);
    await imgGalleryModal.render();
  }
}

export function appendImages(images, imgGrid, allImages) {
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
