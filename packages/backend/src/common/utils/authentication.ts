import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { configuration } from '../config/configuration';

const SALT_ROUNDS = 10;

export const createJWT = async (data: any): Promise<string> => {
  return await jwt.sign(
    data, configuration().accessTokenJwtSecret,
    { expiresIn: configuration().accessTokenExpiresIn }
  );
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, passwordHash);
  if (match) {
    return true;
  }
  return false;
}
