import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import fs from 'fs'
import { jwk2pem } from 'pem-jwk'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import Kratos from '@ioc:Ory/Kratos/Public'
import axios from '@ioc:Ory/Kratos/Axios'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async login({ request, response, logger }) {
    // Extract values from login request
    const { email, password, phone, username } = await request.validate(LoginValidator)
    logger.debug('Request: %o', request.all())

    // Initalizing login flow
    const { data: flow } = await Kratos.initializeSelfServiceLoginViaAPIFlow()
    logger.debug('Login Flow: %o', flow)

    // Extract Flow ID from response
    const flowId = flow.id
    logger.debug('\nFlow ID: %s', flowId)

    // Construct payload for Kratos login
    const payload = {
      identifier: email || username || phone,
      password,
    }

    // Send payload to Kratos and extract response
    const { data: loginResponse } = await axios.post(
      '/self-service/login/methods/password',
      payload,
      {
        params: {
          flow: flowId,
        },
      }
    )

    // Create jwt token
    // Get private key for signing token
    const keysFile = Application.makePath(Env.get('PRIVATE_KEYS_PATH'))
    const { keys } = JSON.parse(fs.readFileSync(keysFile).toString())

    const key = keys[Math.floor(Math.random() * keys.length)]

    const accessToken = jwt.sign(
      {
        jti: uuid(),
        iss: Env.get('BASE_URL'),
        sub: loginResponse.session.identity.id,
        iat: Math.floor(new Date(loginResponse.session.issued_at).getTime() / 1000),
        exp: Math.floor(new Date(loginResponse.session.expires_at).getTime() / 1000),
        ses: loginResponse.session_token,
      },
      jwk2pem(key),
      { algorithm: 'RS256' }
    )

    // Return Kratos response
    response.ok({ data: { keyId: key.kid, accessToken } })
  }

  public async register({ request, response, logger }) {
    // Extract values from registration request
    const { firstName, lastName, email, password, phone, username } = await request.validate(
      RegisterValidator
    )
    logger.debug('Request: %o', request.all())

    // Initialize registration flow
    const { data: flow } = await Kratos.initializeSelfServiceRegistrationViaAPIFlow()
    logger.debug('Login Flow: %o', flow)

    // Extract flow ID from response
    const flowId = flow.id
    logger.debug('\nFlow ID: %s', flowId)

    // Construct payload for Kratos registration
    const payload = {
      'traits.email': email,
      'traits.username': username,
      'traits.phone': phone,
      'traits.name.first': firstName,
      'traits.name.last': lastName,
      password,
    }

    // Send payload to Kratos and extract response
    const { data: regResponse } = await axios.post(
      '/self-service/registration/methods/password',
      payload,
      {
        params: {
          flow: flowId,
        },
      }
    )

    // Return Kratos response
    return response.ok({ data: regResponse })
  }
}
