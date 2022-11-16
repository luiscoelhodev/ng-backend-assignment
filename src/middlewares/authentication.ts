import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import UsersService from "../providers/usersService"

type JwtPayload = {
    id: number
    iat: number
    exp: number
}

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers

    if (!authorization) {
        return response.status(401).send({ message: 'No authorization was provided.' })
    }

    const token = authorization.split(' ')[1]
    const { id } = jwt.decode(token) as JwtPayload

    const userWasFound = await new UsersService().findById(id)
    if (!userWasFound) return response.status(401).send({ message: 'Unauthorized.' })

    const {password, ...rest} = userWasFound

    request.user = rest
    next()
}