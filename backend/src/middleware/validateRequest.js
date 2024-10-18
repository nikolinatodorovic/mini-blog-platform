function validateRequest(schema) {
    return (req, res, next) => {
      try {
        schema.parse(req.body); // Validacija podataka
        next();
      } catch (error) {
        return res.status(400).json({ error: error.errors });
      }
    };
  }
  
  module.exports = validateRequest;
  