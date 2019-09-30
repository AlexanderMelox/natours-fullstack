/**
 *  APIFeatures - All features for quering a route on the API
 *
 * @param  {Object} query - This is a mongoose Query object
 * @param  {Object} requestQueryObject - This is the req.query
 *
 */
class APIFeatures {
  constructor(query, requestQueryObject) {
    this.query = query;
    this.requestQueryObject = requestQueryObject;
  }

  /**
   *  APIFeatures.filter() - filter some fields
   *  Options: gte|gt|lte|lt
   *  Example: duration[gte]: 5
   */
  filter() {
    // queryObj example: { duration: { gte: '5' } }
    const queryObj = { ...this.requestQueryObject };
    // Fields that are to be deleted from the queryObj
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // deletes these excluded fields from the queryObj
    excludedFields.forEach(el => delete queryObj[el]);

    // Stringify's the queryObj to replace gte => $gte
    // Example: queryString = "{"duration":{"$gte":"5"}}"
    const queryString = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    // pipes this filter into the query and returns this for further chaining
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.requestQueryObject.sort) {
      // Example: req.query.sort = 'price,ratingsAverage'
      const sortBy = this.requestQueryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // If no sort is specified, sort by createdBy in descending order
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // putting a "-" de selects from the query
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.query.page, 10) || 1;
    const limit = parseInt(this.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
