import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import UsersService from "../providers/usersService"

type JwtPayload = {
    id: number
    iat: number
    exp: number
}

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers

    if (!authorization) {
        return response.status(401).send({ message: 'No authentication was provided.' })
    }

    const token = authorization.split(' ')[1]
    if (!token) return response.status(400).json({ error: 'The token was not provided.' })

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload
        
        const userWasFound = await new UsersService().findById(id)
        if (!userWasFound) return response.status(401).send({ message: 'Unauthorized.' })

        const {password, ...rest} = userWasFound

        request.user = rest
        next()

    } catch (error: any) {
        return response.status(400).send({ error: error.message })
    }
}