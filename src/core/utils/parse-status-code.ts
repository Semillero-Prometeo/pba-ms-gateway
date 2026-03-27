import { HttpStatus } from '@nestjs/common';

export function parseStatusCode(rpcError: Record<'statusCode', unknown>) {
  return Number.isNaN(+rpcError.statusCode) ? HttpStatus.BAD_REQUEST : +rpcError.statusCode;
}
