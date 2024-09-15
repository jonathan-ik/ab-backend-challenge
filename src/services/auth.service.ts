import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { DataStoredInToken, TokenData } from "../interface/auth.interface";
import { User } from "../interface/users.interface";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { AppDataSource } from "../database";
import { httpException } from "../exceptions/httpException";
import { compare, hash } from "bcrypt";
import { UserEntity } from "../entities/users.entity";
import { v4 as uuidv4 } from 'uuid'; 

const createToken = (user: User, expiresIn: number = 12 * 60 * 60): TokenData => {
  const dataStoredInToken: DataStoredInToken = {
    userId: user.user_id,
  };
  const secretKey: string = String(SECRET_KEY);

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `${tokenData.token}`;
};

export class AuthService extends Repository<UserEntity> {
  public async createUser(userData: User): Promise<User> {
    // Check if the user already exists
    const findUser: User[] = await AppDataSource.query(
      `SELECT email FROM user_entity WHERE email = $1`, 
      [userData.email]
    );
    if (findUser.length) throw new httpException(409, `This email ${userData.email} already exists`);
  
    // Hash the password
    const hashedPassword = await hash(userData.password, 10);
  
    // Generate a unique user ID
    const userId = `usr-${uuidv4()}`; 
  
    // Insert the new user into the database
    const query = `
      INSERT INTO public.user_entity(
        user_id, first_name, last_name, email, password, phone_number, avatar
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
  
    const createdUser: User[] = await AppDataSource.query(query, [
      userId,
      userData.first_name,
      userData.last_name,
      userData.email,
      hashedPassword,
      userData.phone_number,
      userData.avatar 
    ]);
    return createdUser[0];
  }

  public async login(userData: User): Promise<{ cookie: string; user: User }> {
    try {
      // Find user by email
      const findUser: User[] = await AppDataSource.query(
        `SELECT * FROM user_entity WHERE email = $1`, 
        [userData.email]
      );
      
      // If user is not found
      if (!findUser.length) {
        throw new httpException(409,'The email or password is incorrect');
      }
  
      // Check if the provided password matches the stored hashed password
      const isPasswordMatching: boolean = await compare(userData.password, findUser[0].password);
      
      if (!isPasswordMatching) {
        throw new httpException(409,`The email or password is incorrect`);
      }
  
      // If password matches, create a token and cookie
      const tokenData = createToken(findUser[0]);
      const cookie = createCookie(tokenData);
  
      return { cookie, user: findUser[0] };
  
    } catch (error) {
      // Throw specific error based on the case
      throw new httpException(409,`Login failed. Please check your credentials.`);
    }
  }
}


