// Helper to extract domain for the API
export const getDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch {
    return "";
  }
};
