import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    firstName: schema.string({
      escape: true,
      trim: true,
    }),

    lastName: schema.string({
      escape: true,
      trim: true,
    }),

    email: schema.string.optional(
      {
        escape: true,
        trim: true,
      },
      [
        rules.email({
          sanitize: true,
        }),
        rules.requiredIfNotExistsAll(['username', 'phone']),
      ]
    ),

    username: schema.string.optional(
      {
        escape: true,
        trim: true,
      },
      [
        rules.alpha({ allow: ['space', 'underscore', 'dash'] }),
        rules.notIn(['admin', 'super', 'root']),
        rules.requiredIfNotExistsAll(['email', 'phone']),
      ]
    ),

    phone: schema.string.optional(
      {
        escape: true,
        trim: true,
      },
      [rules.mobile({ strict: true }), rules.requiredIfNotExistsAll(['username', 'email'])]
    ),

    password: schema.string.optional({}, [rules.requiredIfExistsAny(['username', 'email'])]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
