import Image from './Image';
import { fillModal } from './modal';

export function handleImageClick(event, allImages) {
  const element = event.target;
  if (element.matches('img')) {
    const {
      dataset: { index },
    } = element;
    fillModal(allImages[index], true);
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
