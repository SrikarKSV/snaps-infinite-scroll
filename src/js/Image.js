import axios from 'axios';

export default class Image {
  static #page = 1;

  constructor(data) {
    this.id = data.id;
    this.pageURL = data.url;
    this.photographer = data.photographer;
    this.photographerURL = data.photographer_url;
    this.avgColor = data.avg_color;
    this.originalLink = data.src.original;
    this.compressedLink = `${this.originalLink}?auto=compress`;
    this.mediumLink = `${this.compressedLink}&cs=tinysrgb&h=350`;
  }

  giveHtmlNode(index) {
    const html = /* html */ `
    <div>
      <img src="${this.mediumLink}" data-index="${index}" alt="Taken by ${this.photographer}"/>
    </div>
    `;
    return document.createRange().createContextualFragment(html);
  }

  isBookmarked() {
    let bookmarkedImages = JSON.parse(localStorage.getItem('images')) || [];
    const image = !!bookmarkedImages.find((image) => image.id === this.id);
    return image;
  }

  bookmark() {
    let bookmarkedImages = JSON.parse(localStorage.getItem('images')) || [];
    localStorage.setItem(
      'images',
      JSON.stringify([
        ...bookmarkedImages,
        { id: this.id, originalLink: this.originalLink },
      ])
    );
  }

  unbookmark() {
    let bookmarkedImages = JSON.parse(localStorage.getItem('images')) || [];
    const imageIndex = bookmarkedImages.findIndex(
      (image) => image.id === this.id
    );
    if (imageIndex >= 0) {
      bookmarkedImages.splice(imageIndex, 1);
      localStorage.setItem('images', JSON.stringify([...bookmarkedImages]));
    }
  }

  // Fetching data
  static resetPage() {
    this.#page = 1;
  }

  static async #fetchData(url) {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: process.env.API_KEY,
      },
    });
    return data;
  }

  static async fetchImages(query = 'curated') {
    let link;
    if (query === 'curated') {
      link = `https://api.pexels.com/v1/curated?page=${this.#page}`;
    } else {
      link = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&page=${this.#page}`;
    }
    const data = await this.#fetchData(link);
    this.#page++;
    return data;
  }

  static async fetchById(id) {
    const link = `https://api.pexels.com/v1/photos/${id}`;
    const data = await this.#fetchData(link);
    return data;
  }
}
