import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  
  catch(exception: HttpException, host: ArgumentsHost) {
    // 1. Look at the dining room (get the request and response objects)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // 2. Figure out how bad the error is (e.g., 400 Bad Request, 404 Not Found)
    const status = exception.getStatus();

    // 3. Get the actual error message the chef was trying to say
    const exceptionResponse: any = exception.getResponse();
    
    // 4. Hand the user a beautifully formatted, polite JSON card
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url, // Tells them which endpoint failed
        message: exceptionResponse.message || exceptionResponse || 'Something went wrong',
        errorType: exception.name, // e.g., "BadRequestException"
      });
  }
}