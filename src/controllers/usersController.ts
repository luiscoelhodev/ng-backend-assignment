import { Request, Response } from "express";
import { usersSchema, validationErrorMessage } from "../validators/usersValidator";

export default class UsersController {
    public async signup(request: Request, response: Response) {
        const user = request.body

        try {
            await usersSchema.validateAsync(user, { abortEarly: false })
        } catch (error) {
            return response.status(422).send({ error: validationErrorMessage })
        }
        return response.status(200).send({ user })
    }
}