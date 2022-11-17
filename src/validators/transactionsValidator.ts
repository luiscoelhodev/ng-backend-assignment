import Joi from 'joi'

const usernameError = 'Required username must not contain white spaces and must be at least 3 characters long.'

const performTransactionSchema = Joi.object({
    amount: Joi.number().min(0.01).required(),
    to: Joi.string().regex(/^\S{3,}$/).required(),
})

export { performTransactionSchema, usernameError }