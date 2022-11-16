import { Request, Response } from "express";
import UsersService from "../providers/usersService";
import { usersSchema, validationErrorMessage } from "../validators/usersValidator";
const usersService = new UsersService()

export default class UsersController {
    public async signup(request: Request, response: Response) {
        const user = request.body

        try {
            await usersSchema.validateAsync(user, { abortEarly: false })
        } catch (error) {
            return response.status(422).send({ error: validationErrorMessage })
        }
        const userWasCreated = await usersService.create(user)
        
        return (userWasCreated.message) ? 
               response.status(201).send(userWasCreated) : 
               response.status(500).send(userWasCreated) 
    }
}