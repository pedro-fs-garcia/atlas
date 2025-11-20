import { Router } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';

const service = new AuthService();

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  try {
    const dto = req.body as RegisterDTO;

    // Basic validation
    if (!dto.username || !dto.email || !dto.password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (dto.password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const result = await service.register(dto);
    return res.status(201).json(result);
  } catch (err: any) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to register user', error: String(err) });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const dto = req.body as LoginDTO;

    // Basic validation
    if (!dto.email || !dto.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await service.login(dto);
    return res.json(result);
  } catch (err: any) {
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to login', error: String(err) });
  }
});
