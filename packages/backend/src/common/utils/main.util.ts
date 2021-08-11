import { v4 as uuidv4 } from 'uuid';

export const newUuid = () => {
  return uuidv4();
}

export const paginateArray = (data: any, skip: number, take: number) => {
  for (let i = 0; i <= 4; i++) {
    data.push(data.slice(i * 2, i * 2 + 2));
  }
};

/**
 * map object keys to lowercase, used for ex to convert header keys to lowercase
 * @param obj
 */
export const mapKeysToLowerCase = (obj: object) => {
  const keys: string[] = Object.keys(obj);
  // initialize result
  const result: { [key: string]: string; } = {};
  keys.forEach((e) => {
    result[e.toLowerCase()] = obj[e];
  });
  return result;
};
