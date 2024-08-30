import { BadRequestException, CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(error => throwError(() => {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error)
        return new BadRequestException([error.message], error.name)
      else {
        return new InternalServerErrorException('Internal Server Error')
      }
    })
    ))
  }
}

export class BadRequestError {

  @ApiProperty()
  message: Array<string>;

  @ApiProperty()
  error: string;

  @ApiProperty({
    default: 400
  })
  statusCode: number = 400;
}

export class ForbiddenResourceError {

  @ApiProperty()
  message: string;

  @ApiProperty({
    default: "Forbiden"
  })
  error: string = "Forbiden";

  @ApiProperty({
    default: 403
  })
  statusCode: number = 403;
}

export class InternalError {

  @ApiProperty()
  error: string = 'Internal Server Error';

  @ApiProperty({
    default: 500
  })
  statusCode: number = 500;
}

export class UnauthorizedError {

  @ApiProperty()
  error: string;

  @ApiProperty({
    default: 500
  })
  statusCode: number = 401;

  @ApiProperty()
  message: string;
}
