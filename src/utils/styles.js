export const makeFontSmallerAsTextGrows = (text) => {
  const minFontSize = 8; // Minimum font size
  const maxFontSize = 16; // Starting font size

  let length = text?.length || 0;
  let fontSize = maxFontSize;

  if (length > 0) {
    fontSize = Math.max(minFontSize, maxFontSize - length);
  }
  return fontSize;
};
