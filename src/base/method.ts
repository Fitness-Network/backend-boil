import { applyDecorators, Delete, Get, HttpStatus, Post, Put } from "@nestjs/common"
import { ApiBadRequestResponse, ApiCreatedResponse, ApiDefaultResponse, ApiInternalServerErrorResponse, ApiResponse } from "@nestjs/swagger"
import { BadRequestError, InternalError } from "src/interceptors/error.interceptors"

export const DefaultPost = (name: string, response?: any) => {
  return applyDecorators(
    Post(name),
    ApiCreatedResponse({
      type: response
    }),
    ApiInternalServerErrorResponse({
      type: InternalError
    }),
    ApiBadRequestResponse({
      type: BadRequestError
    })
  )
}

export const DefaultGet = (name: string, response?: any) => {
  return applyDecorators(Get(name),
    ApiResponse({
      type: response,
      status: HttpStatus.OK
    }),
    ApiInternalServerErrorResponse({
      type: InternalError
    }),
    ApiBadRequestResponse({
      type: BadRequestError
    })
  )
}

export const DefaultPut = (name: string, response?: any) => {
  return applyDecorators(Put(name),
    ApiResponse({
      type: response,
      status: HttpStatus.OK
    }),
    ApiInternalServerErrorResponse({
      type: InternalError
    }),
    ApiBadRequestResponse({
      type: BadRequestError
    })
  )
}

export const DefaultDelete = (name: string, response?: any) => {
  return applyDecorators(Delete(name),
    ApiResponse({
      type: response,
      status: HttpStatus.OK
    }),
    ApiInternalServerErrorResponse({
      type: InternalError
    }),
    ApiBadRequestResponse({
      type: BadRequestError
    })
  )
}
