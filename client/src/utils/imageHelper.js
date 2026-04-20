const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#f0ebe6"/>' +
    '<text x="50%" y="50%" font-family="serif" font-size="48" fill="#c9b8af" text-anchor="middle" dominant-baseline="central">&#x1F374;</text>' +
    '</svg>'
  );

/**
 * Resolves a recipe image URL to an absolute URL or fallback.
 * Handles: absolute URLs, relative /uploads/... paths, empty values.
 */
export function getImageUrl(url) {
  if (!url) return PLACEHOLDER;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Relative path — prepend the Express server origin in development
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Attach to <img onError> to swap in the placeholder if the image fails to load.
 */
export function handleImageError(e) {
  if (e.target.src !== PLACEHOLDER) {
    e.target.src = PLACEHOLDER;
  }
}
