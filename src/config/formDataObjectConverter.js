const formDataStringConvert = (target) => (req, res, next) => {
  if (req.body[target] !== undefined) {
    const body = JSON.parse(req.body[target]);
    req.body = body;
  }
  return next();
};

const formatBody = (req, res, next) => {
  if (req.body !== undefined) {
    const body = JSON.parse(JSON.stringify(req.body));
    req.body = body;
  }
  return next();
};
module.exports = { formDataStringConvert, formatBody };
