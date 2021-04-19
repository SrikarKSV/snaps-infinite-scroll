export function isDark(bgColor) {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

export function handleCloseModal(e, innerElement, outerlement) {
  const isModalInner = !e.target.closest(`.${innerElement}`);
  if (isModalInner) {
    outerlement.classList.remove('show');
  }
}

export function checkFetchError(result, imgGrid) {
  if (!Array.isArray(result?.photos) && result.startsWith('💥 There')) {
    const h4 = document.createElement('h4');
    h4.innerText = result;
    imgGrid.append(h4);
    return true;
  }
  return false;
}
