import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class UserRoute {
  public path = "/users";
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.user.SignUp);
    this.router.get(`${this.path}`, AuthMiddleware, this.user.getUsers);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.user.getUserById);
    this.router.put(`${this.path}`, AuthMiddleware, this.user.updateUser);
    this.router.delete(`${this.path}`, AuthMiddleware, this.user.deleteUser);
  }
}