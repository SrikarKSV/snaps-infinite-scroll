import { handleCloseModal } from './lib/utils';
import Modal from './Modal';

const bookmarkedImages = JSON.parse(localStorage.getItem('images')) || [];

const bookmarkModal = document.querySelector('.bookmark');
const bookmarkImagesEl = document.querySelector('.bookmark__images');
const modalContainer = document.querySelector('.modal');

bookmarkModal.addEventListener('click', (e) =>
  handleCloseModal(e, 'bookmark__inner', bookmarkModal)
);

// BUG: Fix not able to unbookmark due not being in all images

bookmarkImagesEl.addEventListener('click', openBookmarkedModal);

async function openBookmarkedModal(e) {
  const img = e.target;
  if (!img.matches('img')) return;
  const modal = new Modal(modalContainer, bookmarkedImages, img.dataset.id);
  modal.render();
}

export function toggleBookmarkModal() {
  let images = bookmarkedImages;
  images = images.map(
    (image, index) =>
      /* html */ `<li><img src="${
        image.originalLink
      }?auto=compress&cs=tinysrgb&h=130" alt="Bookmarked image ${
        index + 1
      }" data-id="${image.id}"/></li>`
  );
  bookmarkImagesEl.innerHTML = images;
  bookmarkModal.classList.toggle('show');
}
