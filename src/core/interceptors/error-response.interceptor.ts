import { ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply } from 'fastify';
import { CallHandler } from '@nestjs/common';

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Si estamos en un contexto HTTP
        if (context.getType() === 'http') {
          const response = context.switchToHttp().getResponse<FastifyReply>();

          // Verificar si la respuesta parece ser un objeto de error
          if (
            data &&
            typeof data === 'object' &&
            'statusCode' in data &&
            typeof data.statusCode === 'number' &&
            data.statusCode >= 400
          ) {
            // Es un objeto de error, establecer el código de estado HTTP apropiado
            const statusCode = data.statusCode;
            response.status(statusCode);
            return data;
          }
        }
        // Si no es un error o no estamos en contexto HTTP, pasar los datos sin modificar
        return data;
      }),
    );
  }
}
