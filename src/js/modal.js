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
  modalImage.src = object.mediumLink;
  modalImage.alt = `Taken by ${object.photographer}`;
  modalPhototgrapher.innerText = object.photographer;
  modalColor.innerText = object.avgColor;
  modalOriginalLink.href = object.originalLink;
  modalCompressedLink.href = object.compressedLink;
  modalMediumLink.href = object.mediumLink;
  if (toggleModal) {
    modal.classList.add('show');
  }
}
