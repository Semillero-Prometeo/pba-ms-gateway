import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { parseStatusCode } from '../utils/parse-status-code';
import { FastifyReply } from 'fastify';

// Interfaz para los mensajes de error con tipado
interface ErrorResponse {
  statusCode?: number;
  message: string | object;
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const rpcError = exception.getError();
    this.logger.error(rpcError);

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<FastifyReply>();

      // Empty response handling
      if (rpcError.toString().includes('Empty response')) {
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return response.status(statusCode).send({
          statusCode,
          message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1),
        });
      }

      // Unwrap nested error objects: {error: {statusCode, message}, message}
      if (typeof rpcError === 'object' && 'error' in rpcError && typeof rpcError.error === 'object') {
        const error = rpcError.error as ErrorResponse;
        if ('statusCode' in error && 'message' in error) {
          const statusCode = parseStatusCode(error as Record<'statusCode', unknown>);
          return response.status(statusCode).send({
            statusCode,
            message: error.message,
          });
        }
      }

      // Handle errors with statusCode and errors property
      if (
        typeof rpcError === 'object' &&
        'statusCode' in rpcError &&
        ('errors' in rpcError || 'validations' in rpcError)
      ) {
        const errorWithStatus = rpcError as Record<'statusCode', unknown>;
        const statusCode = parseStatusCode(errorWithStatus);
        return response.status(statusCode).send(rpcError);
      }

      // Handle standard error objects with statusCode and message
      if (typeof rpcError === 'object' && 'statusCode' in rpcError && 'message' in rpcError) {
        const errorWithStatus = rpcError as Record<'statusCode', unknown>;
        const statusCode = parseStatusCode(errorWithStatus);
        return response.status(statusCode).send({
          statusCode,
          message: (rpcError as ErrorResponse).message,
        });
      }

      // Default case for string or other error types
      const defaultStatusCode = HttpStatus.BAD_REQUEST;
      return response.status(defaultStatusCode).send({
        statusCode: defaultStatusCode,
        message: rpcError,
      });
    } else {
      // RPC microservice context - retornamos en el formato esperado por NestJS para propagación de errores

      if (typeof rpcError === 'object') {
        // Unwrap nested error objects in RPC context
        if (
          'error' in rpcError &&
          typeof rpcError.error === 'object' &&
          rpcError.error !== null &&
          'statusCode' in rpcError.error &&
          'message' in rpcError.error
        ) {
          const nestedError = rpcError.error as Record<'statusCode', unknown>;
          // Mantener la estructura {statusCode, message} para la propagación correcta
          return {
            statusCode: parseStatusCode(nestedError),
            message: (rpcError.error as ErrorResponse).message,
          };
        }

        // Si el error ya tiene statusCode y message, usarlos directamente
        if ('statusCode' in rpcError && 'message' in rpcError) {
          const errorWithStatus = rpcError as Record<'statusCode', unknown>;
          throw new RpcException({
            statusCode: parseStatusCode(errorWithStatus),
            message: (rpcError as ErrorResponse).message,
          });
        }

        // Si message es un objeto, devolver ese objeto con status code
        if ('message' in rpcError && typeof rpcError.message === 'object' && rpcError.message !== null) {
          const innerMessage = rpcError.message as ErrorResponse;
          const statusCode =
            'statusCode' in innerMessage && typeof innerMessage.statusCode === 'number'
              ? innerMessage.statusCode
              : HttpStatus.BAD_REQUEST;

          return {
            statusCode: statusCode,
            message: innerMessage,
          };
        }
      }

      // Si el error es una cadena con "Empty response"
      if (rpcError.toString().includes('Empty response')) {
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        return {
          statusCode: statusCode,
          message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1),
        };
      }

      // Caso por defecto para errores genéricos
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: rpcError,
      };
    }
  }
}
