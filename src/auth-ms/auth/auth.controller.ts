import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { user } from '@prisma/client';
import { catchError, map } from 'rxjs';
import { JwtAuthGuard, LocalAuthGuard } from 'src/auth/guards';
import { JwtMeAuthGuard } from 'src/auth/guards/jwt-me.guard';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { Public } from 'src/core/decorators/public-routes.decorator';
import { ExtendedRequest, MustChangePassword, RefreshTokenReq, RestorePassReq } from 'src/core/interfaces/auth';
import { RestorePasswordDto, SetPasswordDto } from './dto/restore-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(
    @Request()
    req:
      | (Express.Request & { user: user; body: { push_token: string } })
      | { user: MustChangePassword; body: { push_token: string } },
  ) {
    const mustChangePassword = (req as { user: MustChangePassword }).user;
    const { resetToken } = mustChangePassword;

    const user = (req as { user: user }).user;

    if (
      typeof user === 'object' &&
      'statusCode' in user &&
      (user.statusCode === HttpStatus.BAD_REQUEST || user.statusCode === HttpStatus.UNAUTHORIZED)
    ) {
      throw new RpcException(user);
    }

    if (resetToken) return mustChangePassword;

    const push_token = (req as { body: { push_token: string } }).body.push_token;

    return this.client.send(`${AUTH_MS}.authService.login`, { username: user.username, push_token }).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] AuthController.login', error);
        throw new RpcException(error);
      }),
    );
  }

  @Public()
  @Post('restore-password')
  requestNewPassword(
    @Body() restorePasswordDto: RestorePasswordDto,
    @Headers('origin') origin?: string,
  ) {
    return this.client
      .send(`${AUTH_MS}.authService.requestNewPassword`, {
        email: restorePasswordDto.email,
        origin,
      })
      .pipe(
        catchError((error) => {
          this.logger.error('[ERROR] AuthController.requestNewPassword', error);
          throw new RpcException(error);
        }),
      );
  }

  @Get('me')
  @UseGuards(JwtMeAuthGuard)
  getProfile(@Req() req: Express.Request & { user: user }) {
    return this.client.send(`${AUTH_MS}.authService.getProfile`, { id: req.user.id }).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] AuthController.getProfile', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get('verify')
  @UseGuards(JwtMeAuthGuard)
  verifyToken(@Request() { user }: ExtendedRequest) {
    return this.client.send(`${AUTH_MS}.authService.getProfile`, { id: user.id }).pipe(
      map((profile) => ({
        message: 'Token is valid',
        user: {
          id: user.id,
          roles: user.roles,
          person: profile?.person,
        },
      })),
      catchError((error) => {
        this.logger.error('[ERROR] AuthController.verifyToken', error);
        throw new RpcException(error);
      }),
    );
  }

  @Public()
  @Put('set-password')
  @UseGuards(AuthGuard('password-reset'))
  setNewPassword(@Body() setPasswordDto: SetPasswordDto, @Request() req: RestorePassReq) {
    return this.client
      .send(`${AUTH_MS}.authService.setNewPassword`, {
        userId: req.user.sub,
        newPassword: setPasswordDto.newPassword,
        token: req.headers.authorization.split(' ')[1],
      })
      .pipe(
        catchError((error) => {
          this.logger.error('[ERROR] AuthController.setNewPassword', error);
          throw new RpcException(error);
        }),
      );
  }

  @Public()
  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Request() req: RefreshTokenReq) {
    return this.client.send(`${AUTH_MS}.authService.refreshToken`, { userId: req.user.user.id }).pipe(
      catchError((error) => {
        this.logger.error('[ERROR] AuthController.refreshToken', error);
        throw new RpcException(error);
      }),
    );
  }
}
