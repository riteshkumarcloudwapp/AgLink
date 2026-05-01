const validate = (schema) => {
  return (req,res,next) => {
    const body = {...req.body, ...req.query, ...req.params} ;

    const { error} = schema.validate(body);

    if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
    }
    
    next();
  }
}

export default validate;