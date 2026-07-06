const replacePlaceholders = (
  str: string,
  obj: Record<string, string>,
) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return acc.replace(`{{${key}}}`, value);
  }, str);
};

export default replacePlaceholders;