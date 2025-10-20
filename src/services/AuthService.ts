import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  AuthResponse,
  CreateUserDTO,
  LoginDTO,
  User,
  UserResponse,
} from "../models/User";
import { UserRepository } from "../repositories//UserRepository";
import { config } from "../config";

export class AuthService {
  private userRepository: UserRepository;
  private saltRounds = 10;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private formatuser(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };
  }

  async register(userData: CreateUserDTO): Promise<AuthResponse> {
    const emailExists = await this.userRepository.emailExists(userData.email);

    if (emailExists) {
      throw new Error("Esse email já foi registrado");
    }

    const password_hash = await bcrypt.hash(userData.password, this.saltRounds);

    const user = await this.userRepository.create({
      ...userData,
      password_hash,
    });

    const token = this.generateToken(user.id);

    return {
      user: this.formatuser(user),
      token,
    };
  }

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }

    const token = this.generateToken(user.id);

    return {
      user: this.formatuser(user),
      token,
    };
  }

  private generateToken(userId: number): string {
    const secret = config.jwt.secret;
    if (!secret) {
      throw new Error("Credenciais de autenticação não configuradas");
    }

    return jwt.sign({ userId }, secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): { userId: number } {
    const secret = config.jwt.secret;
    if (!secret) {
      throw new Error("Credenciais de autenticação não configuradas");
    }

    try {
      const decoded = jwt.verify(token, secret) as {
        userId: number;
      };
      return decoded;
    } catch (error) {
      throw new Error("Token inválido");
    }
  }
}
