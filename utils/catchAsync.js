/**
 * catchAsync function is a Higher-order function that wraps
 * any async functions and handles errors automatically
 * by passing it to the next() middleware function.
 *
 * @param  {function} fn - async function for a route controller
 * @returns {function} - returns a wrapped version of the function that was passed.
 */
module.exports = fn => {
  return (req, res, next) => fn(req, res, next).catch(error => next(error));
};
