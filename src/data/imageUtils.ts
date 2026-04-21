const DIARY_IMAGE_BASE_URL = "https://tomokichidiary.com";

export const resolveDiaryImageUrl = (imagePath?: string) => {
  if (!imagePath) return undefined;
  if (/^https?:\/\//.test(imagePath)) return imagePath;

  return imagePath.startsWith("/")
    ? `${DIARY_IMAGE_BASE_URL}${imagePath}`
    : `${DIARY_IMAGE_BASE_URL}/${imagePath}`;
};

type ImageTree = Record<string, unknown> | unknown[] | string | null | undefined;

export const resolveDiaryImageTree = <T extends ImageTree>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => resolveDiaryImageTree(item as ImageTree)) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const resolvedEntries = Object.entries(value).map(([key, entryValue]) => {
    if (
      (key === "imageUrl" || key === "thumbnail") &&
      typeof entryValue === "string"
    ) {
      return [key, resolveDiaryImageUrl(entryValue)];
    }

    return [key, resolveDiaryImageTree(entryValue as ImageTree)];
  });

  return Object.fromEntries(resolvedEntries) as T;
};
