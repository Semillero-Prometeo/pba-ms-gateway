import { Controller, Get } from '@nestjs/common';
import { Public } from './core/decorators/public-routes.decorator';
import { MS_GATEWAY } from './core/constants/ms-names.constant';
import { Health } from './core/interfaces/health';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  getHello(): Health {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      msName: MS_GATEWAY,
    };
  }
}
