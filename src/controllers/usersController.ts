import { Request, Response } from "express";
import UsersService from "../providers/usersService";
import { loginSchema, signupSchema, signupValidationErrorMessage } from "../validators/usersValidator";
import * as argon2 from "argon2"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
const usersService = new UsersService()

export default class UsersController {
    public async signup(request: Request, response: Response) {
        const user = request.body

        try {
            await signupSchema.validateAsync(user, { abortEarly: false })
        } catch (error) {
            return response.status(422).send({ error: signupValidationErrorMessage })
        }
        const userWasCreated = await usersService.create(user)
        
        return (userWasCreated.message) ? 
               response.status(201).send(userWasCreated) : 
               response.status(500).send(userWasCreated) 
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
            return response.status(400).send({ error: 'Invalid e-mail address and/or password. '})
        }

        const {password, ...rest} = userExists

        const verifyPassword = await argon2.verify(userExists.password, user.password)
        if (verifyPassword) {
            const token = jwt.sign({id: userExists.id}, process.env.JWT_SECRET || '', {expiresIn: '24h'})
            return response.status(200).send({ user: rest, token })
        }
        return response.status(400).send({ error: 'Invalid e-mail address and/or password. '})
    }

    public async getUsersBalance(request: Request, response: Response) {
        const { accountId } = request.user
        const balaceWasFound = await usersService.getAccountBalance(accountId)
        return balaceWasFound.balance ? 
            response.status(200).send(balaceWasFound) :
            response.status(500).send(balaceWasFound) 
    }
}