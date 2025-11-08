/**
 * Safely extract ObjectId from a Mongoose reference field
 * Handles populated objects, unpopulated ObjectIds, and null/undefined
 *
 * @param {Object|ObjectId|null} ref - The reference field (populated or not)
 * @returns {string|null} - String representation of the ID, or null if not available
 *
 * @example
 * // Populated reference
 * getRefId({ _id: ObjectId('...'), name: 'John' }) // => '...'
 *
 * // Unpopulated reference (just ObjectId)
 * getRefId(ObjectId('...')) // => '...'
 *
 * // Null or undefined
 * getRefId(null) // => null
 * getRefId(undefined) // => null
 */
export const getRefId = (ref) => {
  if (!ref) return null;

  // If ref has _id property (populated document), use it
  if (ref._id) {
    return ref._id.toString();
  }

  // Otherwise, assume ref is an ObjectId itself (unpopulated)
  return ref.toString();
};
