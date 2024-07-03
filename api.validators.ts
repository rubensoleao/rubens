import { Request, Response, NextFunction } from 'express'
import Joi, {  ValidationResult } from 'joi'

export const userSchema = Joi.object({})

const idParamSchema = Joi.object({
  id: Joi.number().integer().required(),
})

export const validateParamId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = idParamSchema.validate(req.params)

  if (result.error) {
    return res.status(400).json({ error: 'Invalid params' })
  }
  
  next();
}
