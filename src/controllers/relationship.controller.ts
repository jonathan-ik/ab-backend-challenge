import { Request, Response, NextFunction } from "express";
import { RelationshipService } from "../services/relationship.service";
import { RelationshipEntity } from "../entities/relationship.entity";
import { AppDataSource } from "../database";
import { RequestWithUser } from "../interface/auth.interface";


export class RelationshipController {
  public relationshipService = new RelationshipService(RelationshipEntity, AppDataSource.manager);

  // Follow a user
  public followUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const user_id: string | undefined = String(req.user?.user_id);
        const friend_id: string = req.params.id; 
        const createdRelationship = await this.relationshipService.followUser(user_id, friend_id);
        res.status(201).json({ status: 201, message: "User followed successfully", data: createdRelationship });
    } catch (error) {
        // Handle errors by passing them to the next middleware (e.g., error handler)
        next(error);
    }
};

  // Unfollow a user
  public unfollowUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const user_id: string | undefined = String(req.user?.user_id);
        const friend_id: string = req.params.id; 
      const relationship = await this.relationshipService.unfollowUser(user_id, friend_id);
      res.status(200).json({ data: relationship, message: "User unfollowed successfully" });
    } catch (error) {
      next(error);
    }
  };

  // Get relationships (followers, following, or friends)
  public getRelationships = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const type = req.query.type as string; // 'followers', 'following', or 'friends'
      const relationships = await this.relationshipService.getRelationships(userId, type);
      res.status(200).json({ data: relationships, message: `${type} retrieved successfully` });
    } catch (error) {
      next(error);
    }
  };

  public isFollowing = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const userId: string | undefined = String(req.user?.user_id);
        const friend_id: string = req.params.id;
      const isFollowing: boolean = await this.relationshipService.isFollowing(userId, friend_id);
      res.status(200).json({ status: 200, message: "User is following", data: isFollowing });
    } catch (error) {
      next(error);
    }
  };
}
