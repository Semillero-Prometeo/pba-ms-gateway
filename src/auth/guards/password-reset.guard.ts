import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PasswordResetGuard extends AuthGuard('password-reset') {}
