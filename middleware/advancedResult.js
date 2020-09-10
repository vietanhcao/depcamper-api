const advancedResult = (model, populate) => async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };
  console.log('exports.getBootcamps -> reqQuery', reqQuery);

  // Fields  to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((params) => delete reqQuery[params]);

  let queryStr = JSON.stringify(reqQuery);

  // Create operator ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  query = model.find(JSON.parse(queryStr));

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

  res.advancedResult = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }
  next();
}

module.exports = advancedResult 