import { Request, Response } from "express";

export default class UsersController {
    public async signup(request: Request, response: Response) {
        const user = request.body
        return response.status(200).send({ user })
    }
}