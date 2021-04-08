import axios from 'axios';

export default class Image {
  static #page = 1;

  constructor(data) {
    this.id = data.id;
    this.photographer = data.photographer;
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

  static async fetchImagesQuery(query) {
    const data = await this.#fetchData(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&page=${this.#page}`
    );
    this.#page++;
    return data;
  }
  // TODO: Make a static method to fetch results based on query and id
  // TODO: Make a static method to check if an id is bookmarked (in LS)
  // TODO: Make a method to bookmark an image to storage and toggles property
  // TODO: Make a method to unbookmark an image from storage and toggles property
}
