import { Request, Response } from "express";
import UsersService from "../providers/usersService";
import { getUsersTransactionsQuerySchema, loginSchema, signupSchema, signupValidationErrorMessage, transactionDateError, transactionTypeError } from "../validators/usersValidator";
import * as argon2 from "argon2"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { usernameError } from "../validators/transactionsValidator";
import TransactionsService from "../providers/transactionsService";
const usersService = new UsersService()
const transactionsService = new TransactionsService()

export default class UsersController {
    public async signup(request: Request, response: Response) {
        const { body } = request

        try {
            await signupSchema.validateAsync(body, { abortEarly: false })
        } catch (error: any) {
            if (error.message.includes('^\\S{3,}$')) {
                return response.status(422).send({ error: usernameError })
            }
            return response.status(422).send({ error: signupValidationErrorMessage })
        }
        const userWasCreated = await usersService.create(body)

        if (userWasCreated.message) {
            return response.status(201).send(userWasCreated)
        }
        else if (userWasCreated.error.includes('This username is already in use!')) {
            return response.status(400).send(userWasCreated)
        }
        else {
            return response.status(500).send(userWasCreated)
        }
    }

    public async login(request: Request, response: Response) {
        const user = request.body
        
        try {
            await loginSchema.validateAsync(user, { abortEarly: false })
        } catch (error) {
            return response.status(422).send({ error })
        }
        const userExists = await usersService.findByUsername(user.username)
        if (!userExists) {
            return response.status(400).send({ error: 'Invalid username and/or password. '})
        }

        const {password, ...rest} = userExists

        const verifyPassword = await argon2.verify(userExists.password, user.password)
        if (verifyPassword) {
            const token = jwt.sign({id: userExists.id}, process.env.JWT_SECRET || '', {expiresIn: '24h'})
            return response.status(200).send({ user: rest, token })
        }
        return response.status(400).send({ error: 'Invalid username and/or password. '})
    }

    public async getUsersBalance(request: Request, response: Response) {
        const { accountId } = request.user
        const balaceWasFound = await usersService.getAccountBalance(accountId)
        return balaceWasFound.balance ? 
            response.status(200).send(balaceWasFound) :
            response.status(500).send(balaceWasFound) 
    }

    public async getUsersTransactions(request: Request, response: Response) {
        const { accountId } = request.user

        if (Object.keys(request.query).length !== 0) {
            try {
                await getUsersTransactionsQuerySchema.validateAsync(request.query, { abortEarly: false })
            } catch (error: any) {
                if (error.message.includes('^(in|out)$')) {
                    return response.status(422).send({ error: transactionTypeError })
                }
                return response.status(422).send({ error: transactionDateError })
            }

            const transactions = await transactionsService.getUsersTransactions({
                accountId,
                date: request.query.date?.toString(),
                transactionType: request.query.transactionType?.toString()
            })
            if (transactions.length === 0) return response.status(404).send({ message: 'No transactions found!' })
            return response.send({ transactions })
        }
        
        const transactions = await transactionsService.getUsersTransactions({ accountId })

        if (transactions.length === 0) return response.status(404).send({ message: 'No transactions found!' })

        return response.send({ transactions })
    }
}