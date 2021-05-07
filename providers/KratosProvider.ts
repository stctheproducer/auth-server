import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { AdminApi, PublicApi } from '@ory/kratos-client'
import axios from 'axios'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = (await import('@ioc:Adonis/Lucid/Database')).default
|   const Event = (await import('@ioc:Adonis/Core/Event')).default
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class KratosProvider {
  public static needsApplication = true
  constructor(protected application: ApplicationContract) {}

  public register() {
    // Register your own bindings
    // const kratosPublic =
    this.application.container.singleton('Ory/Kratos/Public', () => {
      const config = this.application.container.use('Adonis/Core/Config').get('kratos', {})

      return new PublicApi(config.public)
    })

    this.application.container.singleton('Ory/Kratos/Admin', () => {
      const config = this.application.container.use('Adonis/Core/Config').get('kratos', {})

      return new AdminApi(config.admin)
    })

    this.application.container.singleton('Ory/Kratos/Axios', () => {
      const config = this.application.container.use('Adonis/Core/Config').get('kratos', {})

      return axios.create(config.axios)
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
    const HealthCheck = (await import('@ioc:Adonis/Core/HealthCheck')).default
    const Kratos = (await import('@ioc:Ory/Kratos/Admin')).default
    const { status: alive } = await Kratos.isAlive()
    const { status: ready } = await Kratos.isReady()

    HealthCheck.addChecker('kratos', async () => {
      return {
        displayName: 'Kratos Connection',
        health: {
          healthy: alive === 200 && ready === 200,
        },
      }
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
