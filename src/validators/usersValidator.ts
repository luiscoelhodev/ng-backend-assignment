import Joi from 'joi'

const signupSchema = Joi.object({
    username: Joi.string().min(3).regex(/^\S{3,}$/).required(),
    password: Joi.string().regex(/^(?=.*[0-9])(?=.*[A-Z]).{8,}$/).required()
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const getUsersTransactionsQuerySchema = Joi.object({
    date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    transactionType: Joi.string().regex(/^(in|out)$/).optional()
})

const signupValidationErrorMessage: string = 'Password must include at least one digit 0-9, one uppercase letter A-Z and must be at least 8 characters long.'
const transactionTypeError: string = `Options for filtering transactions only include 'in' or 'out'.`
const transactionDateError: string = `Date format should be 'yyyy-MM-dd`
export { signupSchema, 
        loginSchema, 
        signupValidationErrorMessage, 
        getUsersTransactionsQuerySchema, 
        transactionTypeError,
        transactionDateError }