import fmp from '@fastify/multipart';
import proxy from '@fastify/http-proxy';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationOptions from './core/utils/validation-options';
import { RpcCustomExceptionFilter } from './core/filters/rpc-exception.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ErrorResponseInterceptor } from './core/interceptors/error-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Ms Gateway');

  const fastifyAdapter = new FastifyAdapter({
    logger: false,
  });

  fastifyAdapter.register(fmp, {
    limits: {
      fieldNameSize: 1000,
      fieldSize: 10000,
      fields: 10,
      fileSize: 200 * 1024 * 1024, // 200 MB
      files: 1,
      headerPairs: 200,
    },
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
    // logger: LoggerConfig,
  });

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Active-Role', 'Cache-Control'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  const configService: ConfigService = app.get<ConfigService>(ConfigService);

  // Set the global pipes
  app.useGlobalInterceptors(new ErrorResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  // Get the port from the configuration
  const port: number = configService.get<number>('configEnvs.port') || 3000;

  await app.listen(port, '0.0.0.0');
  logger.log('Application is running on: ' + (await app.getUrl()));
}
bootstrap();
