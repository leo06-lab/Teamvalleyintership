const BACKEND_URL = "http://localhost:5000";

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads")) {
    return `${BACKEND_URL}${imagePath}`;
  }

  return imagePath;
};