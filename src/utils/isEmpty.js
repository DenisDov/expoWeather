/**
 * https://www.30secondsofcode.org/js/s/is-empty
 * Checks if the a value is an empty object/collection,
 * has no enumerable properties or is any type that is not considered a collection.
 *
 * @param {string} value Value
 * @return {string} boolean
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

const isEmpty = (val) => val == null || !(Object.keys(val) || val).length;

export { isEmpty };
