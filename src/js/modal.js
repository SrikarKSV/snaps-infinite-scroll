import { isDark } from './lib/utils';

const modal = document.querySelector('.modal');
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

export function fillModal(object, toggleModal = false) {
  // No need to fetch the modal image as already loaded for gallery!
  modalImage.src = object.mediumLink;
  modalImage.alt = `Taken by ${object.photographer}`;
  modalPhototgrapher.innerText = object.photographer;
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
