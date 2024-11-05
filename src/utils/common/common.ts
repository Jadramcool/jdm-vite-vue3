export const clone = (obj: Record<string, any>): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (Array.isArray(obj)) {
    return obj.map(clone);
  }

  const clonedObj: { [key: string]: any } = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    clonedObj[key] = clone(obj[key]);
  }

  return clonedObj;
};
