import { isDark } from './lib/utils';

const modal = document.querySelector('.modal');
const modalInner = document.querySelector('.modal__inner');
const modalImage = document.querySelector('.modal__image img');
const modalPhototgrapher = document.querySelector('.modal__photographer');
const modalColor = document.querySelector('.modal__avgcolor');
const modalOriginalLink = document.querySelector('.button.original');
const modalCompressedLink = document.querySelector('.button.compressed');
const modalMediumLink = document.querySelector('.button.medium');

modal.addEventListener('click', handleCloseModal);

function handleCloseModal(e) {
  const isModalInner = !e.target.closest('.modal__inner');
  if (isModalInner) {
    modal.classList.remove('show');
  }
}

export function handleDirection(e, allImages) {
  const button = e.currentTarget;
  const closestModalInner = button.closest('.modal__inner');
  const modalIndex = parseInt(closestModalInner.dataset.index);

  loadModalData(modalIndex, allImages, button.dataset.direction);
}

export function loadModalData(modalIndex, allImages, direction) {
  direction === 'left' ? modalIndex-- : modalIndex++;
  if (!allImages[modalIndex]) return;
  fillModal(allImages[modalIndex], modalIndex, false);
}

export function fillModal(object, index, toggleModal = false) {
  // Addind data-index for switching modal data
  modalInner.dataset.index = index;
  // No need to fetch the modal image as already loaded for gallery!
  modalImage.src = object.mediumLink;
  modalImage.alt = `Taken by ${object.photographer}`;

  // Setting photogrpher page link
  modalPhototgrapher.innerText = object.photographer;
  modalPhototgrapher.href = object.photographerURL;

  modalColor.innerText = object.avgColor;
  // Showing the Avg. color as background
  modalColor.style.backgroundColor = object.avgColor;
  // Setting text color based on background
  modalColor.style.color = isDark(object.avgColor) ? '#000' : '#fff';

  modalOriginalLink.href = object.originalLink;
  modalCompressedLink.href = object.compressedLink;
  modalMediumLink.href = object.mediumLink;
  if (toggleModal) {
    modal.classList.add('show');
  }
}
