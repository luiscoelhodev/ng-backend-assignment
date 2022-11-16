import Joi from 'joi'

const signupSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().regex(/^(?=.*[0-9])(?=.*[A-Z]).{8,}$/).required()
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const signupValidationErrorMessage: string = 'Password must include at least one digit 0-9, one uppercase letter A-Z and must be at least 8 characters long.'

export { signupSchema, loginSchema, signupValidationErrorMessage }