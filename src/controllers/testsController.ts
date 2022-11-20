import { Request, Response } from "express";

export default class TestsController {
    public async hello(_request: Request, response: Response) {
        return response.send({ hello: 'world', serverIsRunning: true })
    }

    public testMiddleware(request: Request, response: Response) {
        return response.send({ userWasDetected: true, user: request.user })
    }
}