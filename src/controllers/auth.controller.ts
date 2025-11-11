import { Request, Response } from "express"

export const handleInitSignup = (req: Request, res: Response) => {
    res.status(200).json({
        message: "otp send successfully"
    })
}

export const handleInitSignin = (req: Request, res: Response) => {
    res.status(200).json({
        message: "otp send successfully"
    })
}

export const handleSignup = (req: Request, res: Response) => {
    res.status(200).json({
        message: "user created successfully"
    })
}


export const handleSignin = (req: Request, res: Response) => {
    res.status(200).json({
        message: "user signined in"
    })
}

