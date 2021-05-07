import Env from '@ioc:Adonis/Core/Env'
import { Configuration } from '@ory/kratos-client'
import { AxiosRequestConfig } from 'axios'

export default {
  public: new Configuration({ basePath: Env.get('KRATOS_PUBLIC_URL') }),
  admin: new Configuration({ basePath: Env.get('KRATOS_ADMIN_URL') }),
  axios: {
    baseURL: Env.get('KRATOS_PUBLIC_URL'),
  } as AxiosRequestConfig,
}
