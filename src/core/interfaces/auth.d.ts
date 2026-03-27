import { Request } from 'express';
import { person } from '@prisma/client';
import { ResetPasswordPayload } from 'src/auth/interfaces/payload';
import { RefreshTokenPayload } from 'src/auth/strategies/refresh-token.strategy';

export interface ExtendedRequest extends Request {
  user: RequestUser;
}

export interface RestorePassReq extends Request {
  user: ResetPasswordPayload;
}

export interface RefreshTokenReq extends Request {
  user: RefreshTokenPayload;
}

export interface RequestUser {
  id: string;
  roles: string[];
  email?: string;
  person?: person;
}

export interface MustChangePassword {
  message: string;
  resetToken: string;
}

export interface Payload {
  user: RequestUser;
  token: string;
  iat?: number;
  exp?: number;
}
