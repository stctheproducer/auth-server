/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error, ctx: HttpContextContract) {
    const status = error.status || 500

    const [, path, line] = error.stack.match(/\/([\/\w-_\.@]+\.ts|.js):(\d*):(\d*)/)

    ctx.logger.error('Error stack: %s', error.stack)

    if (error.code) {
      ctx.logger.error(`${error.name}: ${error.message} at line ${line} in file: ${path}`)

      switch (error.code) {
        case 'E_VALIDATION_FAILURE':
          return ctx.response.status(status).send({
            status: status,
            code: error.code,
            error: `Some fields do not satisfy the validation check`,
            messages: error.messages.errors,
            requestId: ctx.request.id(),
            path: ctx.request.url(true),
            timestamp: new Date().toISOString(),
            data: {},
          })

        default:
          return ctx.response.status(status).send({
            status: status,
            code: error.code,
            error: error,
            messages: [
              {
                message: error.message.split(':')[1].match(/\w+/g).join(' '),
              },
            ],
            requestId: ctx.request.id(),
            path: ctx.request.url(true),
            timestamp: new Date().toISOString(),
            data: {},
          })
      }
    }

    return ctx.response.internalServerError({
      status,
      messages: [
        {
          message: error.message,
        },
      ],
      requestId: ctx.request.id(),
      errorPath: path,
      errorLine: line,
      path: ctx.request.url(true),
      timestamp: new Date().toISOString(),
      data: {},
    })

    // return super.handle(error, ctx)
  }

  // public async report(error, { request }: HttpContextContract) {
  //   const badges = <LogOwlBadges>request.headers()
  //   delete badges.cookie
  //   LogOwl.emitError(error, badges)
  // }
}
