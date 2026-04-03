const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1495195134817-a169b329ff0b?q=80&w=600&auto=format&fit=crop";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return FALLBACK_IMAGE;
  if (imageUrl.startsWith('http')) return imageUrl;
  // If it's a relative backend path
  return `http://localhost:5000${imageUrl}`;
};

export const handleImageError = (e) => {
  // Prevent infinite loop if fallback image also fails
  if (e.target.src !== FALLBACK_IMAGE) {
    e.target.src = FALLBACK_IMAGE;
  }
};
