import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { CreateUserDto } from "../dtos/users.dto";


export class AuthRoute {
    public router = Router();
    public auth = new AuthController()

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/login", this.auth.Login);
        this.router.get("/refresh", this.auth.refresh);
    }
}