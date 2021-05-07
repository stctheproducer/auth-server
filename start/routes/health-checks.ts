import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/health', async ({ response, logger }) => {
  const report = await HealthCheck.getReport()
  const isLive = await HealthCheck.isLive()

  logger.info('Health report: %o', report)

  return isLive ? response.status(200).send({ status: 'ok' }) : response.status(400).send(report)
})
