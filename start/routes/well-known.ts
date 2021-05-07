import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs'

Route.group(() => {
  Route.get('jwks.json', async ({ logger, response }) => {
    const keysFile = Application.makePath(Env.get('KEYS_PATH'))
    const keys = fs.readFileSync(keysFile)

    logger.debug(`Getting jwks from ${keysFile}`)

    response.ok(keys)
  })
}).prefix('.well-known')
