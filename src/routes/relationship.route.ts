import { RelationshipController } from "../controllers/relationship.controller";
import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class RelationshipRoute {
  public path = "/relationships";
  public router = Router();
  public relationship = new RelationshipController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/:userId`, AuthMiddleware, this.relationship.getRelationships);
    this.router.post(`${this.path}/follow`, AuthMiddleware, this.relationship.followUser);
    this.router.post(`${this.path}/unfollow`, AuthMiddleware, this.relationship.unfollowUser);
  }
}
