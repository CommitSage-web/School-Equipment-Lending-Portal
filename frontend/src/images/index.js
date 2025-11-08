// Build a map of image filename (lowercased) -> image URL
// Uses webpack's require.context (works with Create React App / webpack setups)
function importAll(r) {
  const images = {};
  r.keys().forEach((key) => {
    const fileName = key.replace('./', '');
    // store by lowercased filename for case-insensitive lookup
    images[fileName.toLowerCase()] = r(key);
  });
  return images;
}

const images = importAll(require.context('.', false, /\.(png|jpe?g|svg)$/));

export default images;
