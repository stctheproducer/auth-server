import { Exception } from '@poppinss/utils'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new ChandaException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class GenericException extends Exception {
  constructor(message: string, status?: number, code?: string) {
    super(message, status, code)
  }
}
