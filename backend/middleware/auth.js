const jwt = require('jsonwebtoken');

module.exports = {

  auth: (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('No token provided');

    try {
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      res.locals.jwt = decoded;
      next();
    } catch (ex) {
      res.status(400).send('Invalid token.');
    }
  },
  
  getUser: (res, id = res.locals.jwt._id) => res.locals.models.User.findById(id).select('-password')

  // getUser: (res, id = res.locals.jwt._id) => {
  //   const ret = res.locals.models.User.findById(id).select('-password');
  //   console.log(ret);
  //   return ret;
  // },

};
