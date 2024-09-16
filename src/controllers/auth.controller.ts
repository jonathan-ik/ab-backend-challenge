import { AppDataSource } from "../database";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../entities/users.entity";
import { Request, Response, NextFunction } from "express";
import { User } from "../interface/users.interface";

export class AuthController {
  public auth = new AuthService(UserEntity, AppDataSource.manager);

  public Login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const { cookie, user, accessData } = await this.auth.login(userData);
      res.setHeader('Set-Cookie', [`${cookie}; SameSite=None; Secure; HttpOnly`]);
      res.status(200).json({ status: 200, message: "login successful", data: user, token: accessData });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies['Authorization']
      const refreshData = await this.auth.refreshToken(token);
      res.status(200).json({ data: refreshData.cookie, message: 'refresh' });
    } catch (error) {
      next(error);
    }
  };
}
