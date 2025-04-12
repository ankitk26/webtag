export const getUrlDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  } catch (error) {
    return url;
  }
};
