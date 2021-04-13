import { isDark } from './lib/utils';

export default class Modal {
  constructor(modalContainer, allImages, index) {
    this.allImages = allImages;
    this.index = index;
    this.modalContainer = modalContainer;

    // Binding callbacks
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this._handleModalBtns = this._handleModalBtns.bind(this);
    this._handleKeyboard = this._handleKeyboard.bind(this);

    this.modalBtns = this.modalContainer.querySelectorAll('button');

    // Event Listeners
    this.modalContainer.addEventListener('click', this.handleCloseModal);

    this.modalBtns.forEach((btn) =>
      btn.addEventListener('click', this._handleModalBtns)
    );

    window.addEventListener('keyup', this._handleKeyboard);

    // Selecting elements for filling up modal
    this.modalInner = this.modalContainer.querySelector('.modal__inner');
    this.modalImage = this.modalContainer.querySelector('.modal__image img');
    this.modalPhototgrapher = this.modalContainer.querySelector(
      '.modal__photographer'
    );
    this.modalColor = this.modalContainer.querySelector('.modal__avgcolor');
    this.modalOriginalLink = this.modalContainer.querySelector(
      '.button.original'
    );
    this.modalCompressedLink = this.modalContainer.querySelector(
      '.button.compressed'
    );
    this.modalMediumLink = this.modalContainer.querySelector('.button.medium');
    this.modalBookmarkBtn = this.modalContainer.querySelector(
      '.button--bookmark'
    );
  }

  _handleModalBtns(e) {
    const button = e.currentTarget;

    if (button.matches('.button--bookmark')) {
      !this.allImages[this.index].isBookmarked()
        ? this.allImages[this.index].bookmark()
        : this.allImages[this.index].unbookmark();
      this._toggleBookmarkBtnStyle(this.allImages[this.index].isBookmarked());
    } else {
      this._loadModalData(button.dataset.direction);
    }
  }

  _loadModalData(direction) {
    // Storing index in temp variable to check if the image instance exists
    let index = this.index;
    direction === 'left' ? index-- : index++;
    if (!this.allImages[index]) return;
    // If it exists the instance variable is changes for progression
    this.index = index;
    this._fillModal(this.allImages[this.index]);
  }

  _toggleBookmarkBtnStyle(isBookmarked) {
    if (isBookmarked) {
      this.modalBookmarkBtn.innerText = 'Bookmarked';
      this.modalBookmarkBtn.style.backgroundColor = 'var(--green)';
    } else {
      this.modalBookmarkBtn.innerText = 'Bookmark';
      this.modalBookmarkBtn.style.backgroundColor = 'var(--yellow)';
    }
  }

  _handleKeyboard(e) {
    // Switch images in modal
    switch (e.key) {
      case 'ArrowLeft':
        this._loadModalData('left');
        break;
      case 'ArrowRight':
        this._loadModalData('right');
        break;
    }
    if (e.key === 'Escape') {
      this.modalContainer.classList.remove('show');
    }
  }

  _fillModal(object) {
    // No need to fetch the modal image as already loaded for gallery!
    this.modalImage.src = object.mediumLink;
    this.modalImage.alt = `Taken by ${object.photographer}`;

    // Setting photogrpher page link
    this.modalPhototgrapher.innerText = object.photographer;
    this.modalPhototgrapher.href = object.photographerURL;

    // Toggle bookmark button
    this._toggleBookmarkBtnStyle(object.isBookmarked());

    this.modalColor.innerText = object.avgColor;
    // Showing the Avg. color as background
    this.modalColor.style.backgroundColor = object.avgColor;
    // Setting text color based on background
    this.modalColor.style.color = isDark(object.avgColor) ? '#000' : '#fff';

    this.modalOriginalLink.href = object.originalLink;
    this.modalCompressedLink.href = object.compressedLink;
    this.modalMediumLink.href = object.mediumLink;
  }

  handleCloseModal(e) {
    const isModalInner = !e.target.closest('.modal__inner');
    if (isModalInner) {
      // Removing listners before closing modal
      this.modalContainer.removeEventListener('click', this.handleCloseModal);
      this.modalBtns.forEach((btn) =>
        btn.removeEventListener('click', this._handleModalBtns)
      );
      window.removeEventListener('keyup', this._handleKeyboard);

      this.modalContainer.classList.remove('show');
    }
  }

  render() {
    this._fillModal(this.allImages[this.index]);
    this.modalContainer.classList.add('show');
  }
}
