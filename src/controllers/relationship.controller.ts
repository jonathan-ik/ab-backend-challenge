import { Request, Response, NextFunction } from "express";
import { RelationshipService } from "../services/relationship.service";
import { RelationshipEntity } from "../entities/relationship.entity";
import { AppDataSource } from "../database";


export class RelationshipController {
  public relationshipService = new RelationshipService(RelationshipEntity, AppDataSource.manager);

  // Follow a user
  public followUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, friendId } = req.body;
      const relationship = await this.relationshipService.followUser(userId, friendId);
      res.status(200).json({ data: relationship, message: "User followed successfully" });
    } catch (error) {
      next(error);
    }
  };

  // Unfollow a user
  public unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, friendId } = req.body;
      const relationship = await this.relationshipService.unfollowUser(userId, friendId);
      res.status(200).json({ data: relationship, message: "User unfollowed successfully" });
    } catch (error) {
      next(error);
    }
  };

  // Get relationships (followers, following, or friends)
  public getRelationships = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const type = req.query.type as string; // 'followers', 'following', or 'friends'
      const relationships = await this.relationshipService.getRelationships(userId, type);
      res.status(200).json({ data: relationships, message: `${type} retrieved successfully` });
    } catch (error) {
      next(error);
    }
  };
}
