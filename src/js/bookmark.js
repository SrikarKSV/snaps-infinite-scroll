import { handleCloseModal } from './lib/utils';
import Modal from './Modal';

const bookmarkModal = document.querySelector('.bookmark');
const bookmarkImagesEl = document.querySelector('.bookmark__images');
const modalContainer = document.querySelector('.modal');

bookmarkModal.addEventListener('click', (e) =>
  handleCloseModal(e, 'bookmark__inner', bookmarkModal)
);

bookmarkImagesEl.addEventListener('click', openBookmarkedModal);
window.addEventListener('keyup', (e) =>
  handleCloseModal(e, 'bookmark__inner', bookmarkModal)
);

async function openBookmarkedModal(e) {
  const img = e.target;
  if (!img.matches('img')) return;
  const bookmarkedImages = JSON.parse(localStorage.getItem('images')) || [];
  const modal = new Modal(modalContainer, bookmarkedImages, img.dataset.index);
  await modal.render();
  bookmarkModal.classList.remove('show');
}

export function toggleBookmarkModal() {
  let bookmarkedImages = JSON.parse(localStorage.getItem('images')) || [];
  bookmarkedImages = bookmarkedImages
    .map(
      (image, index) =>
        /* html */ `<li><img src="${
          image.originalLink
        }?auto=compress&cs=tinysrgb&h=130" alt="Bookmarked image ${
          index + 1
        }" data-index="${index}"/></li>`
    )
    .join(' ');
  bookmarkImagesEl.innerHTML = bookmarkedImages;
  bookmarkModal.classList.toggle('show');
}
