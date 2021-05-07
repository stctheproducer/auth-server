/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import './routes/health-checks'
import './routes/auth'
import './routes/well-known'
import GenericException from 'App/Exceptions/GenericException'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/error', async () => {
  throw new GenericException('I threw an error')
})
