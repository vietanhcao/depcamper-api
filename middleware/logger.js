
/**
 * 
 * @desc Logs request to console
 */

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
  console.log('Middleware running')

  next();
}

module.exports = logger