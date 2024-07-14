import Joi from 'joi';

export const userSchema = Joi.object({});

const idParamSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const validateParamId = (req, res, next) => {
  const result = idParamSchema.validate(req.params);

  if (result.error) {
    return res.status(400).json({ error: 'Invalid params' });
  }

  next();
};
