import { query } from "../database/connection";
import { User, CreateUserDTO } from "../models/User";

export class UserRepository {
  async create(
    userData: CreateUserDTO & { password_hash: string }
  ): Promise<User> {
    const sql = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, password_hash, created_at, updated_at
    `;

    const result = await query(sql, [
      userData.name,
      userData.email,
      userData.password_hash,
    ]);

    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const sql = "SELECT id, name, email FROM users";
    const result = await query(sql);
    return result.rows;
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await query(sql, [email]);
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const sql = `
      SELECT id, name, email, password_hash, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  async emailExists(email: string): Promise<boolean> {
    const sql = `
      SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;

    const result = await query(sql, [email]);
    return result.rows[0].exists;
  }
}
