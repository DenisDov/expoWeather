/**
 * https://www.30secondsofcode.org/js/s/is-empty
 * Checks if the a value is an empty object/collection,
 * has no enumerable properties or is any type that is not considered a collection.
 *
 * @param {any} value Value
 * @return {boolean} boolean
 *
 * @example
 *
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty(''); // true
 * isEmpty([1, 2]); // false
 * isEmpty({ a: 1, b: 2 }); // false
 * isEmpty('text'); // false
 * isEmpty(123); // true - type is not considered a collection
 * isEmpty(true); // true - type is not considered a collection
 */
export const isEmpty = (val: any): boolean =>
  val == null || !(Object.keys(val) || val).length;
