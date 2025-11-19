import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { User } from './user.entity';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from './dto/auth.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export class AuthService {
  private repository: Repository<User> = AppDataSource.getRepository(User);

  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    // Check if user already exists
    const existingUser = await this.repository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Create user
    const user = this.repository.create({
      username: dto.username,
      email: dto.email,
      password_hash,
    });

    const savedUser = await this.repository.save(user);

    // Generate token
    const token = this.generateToken(savedUser.id);

    return {
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
      },
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    // Find user by email
    const user = await this.repository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async getUserById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  verifyToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}
