const escapeStringRegexp = require('escape-string-regexp');

/**
 * @desc include pagination, filter, select etc...
 * @params model required
 * 
 */
const advancedResult = (model, populate) => async (req, res, next) => {
  try {

  let query;

  const reqQueryClone = { ...req.query };

  // Repalce "_" to "." reason mongoSanitize
  const reqQuery  = Object.keys(reqQueryClone).reduce((obj, key) =>{
    if(key.includes('_')){
      const keyReplace = key.replace(/_/g, '.')
      obj[keyReplace] = reqQueryClone[key];
      return obj;
    }
    obj[key] = reqQueryClone[key];
    return obj;
  },{})

  // Fields  to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((params) => delete reqQuery[params]);

  let queryStr = JSON.stringify(reqQuery);

  // Create operator ($gt, $gte, etc)  regex => search like
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|regex)\b":/g, (match) => `$${match}`);

  let queryParser = JSON.parse(queryStr);

  // add escapeString in $regex
  queryParser  = Object.keys(queryParser).reduce((obj, key) =>{
    if(queryParser[key].$regex){
      obj[key] = { $regex: new RegExp(escapeStringRegexp(queryParser[key].$regex))};
      return obj;
    }
    obj[key] = queryParser[key]
    return obj;
  },{})

  query = model.find(queryParser);
  console.log('exports.getBootcamps -> reqQuery', reqQuery);
  console.log('exports.getBootcamps -> reqQuery', queryStr);
  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.replace(/,/g, ' ');
    query = query.select(fields);
  }

  // Sort Fields
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(/,/g, ' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if(populate){
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit,
    };
  } 

  // set advancedResult
  res.advancedResult = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }
  next();
      
  } catch (err) {
    return next(err);
  }
}

module.exports = advancedResult 