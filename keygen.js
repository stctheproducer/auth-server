const fs = require('fs')
const quickEncrypt = require('quick-encrypt')
const { v4: uuid } = require('uuid')
const pemToJwk = require('rsa-pem-to-jwk')

const NUMBER_OF_KEYS = 5

const jwks = {
  keys: [],
}

const privateJwks = {
  keys: [],
}

// Check if keys folder exists or create one
if (!fs.existsSync(`keys`)) fs.mkdirSync(`keys`)

// Generate the PEM files
console.info(`Generating ${NUMBER_OF_KEYS} public/private key pairs...`)
for (let index = 0; index < NUMBER_OF_KEYS; index++) {
  const keys = quickEncrypt.generate(2048)

  console.info(`Generating key ${index + 1} of ${NUMBER_OF_KEYS}`)

  // Write public key
  // fs.writeFileSync(`keys/public.${index + 1}.pem`, keys.public, `utf8`)
  // Write private key
  // fs.writeFileSync(`keys/private.${index + 1}.pem`, keys.private, `utf8`)

  // Modify permissions
  // fs.chmodSync(`keys/public.${index + 1}.pem`, `600`)
  // fs.chmodSync(`keys/private.${index + 1}.pem`, `600`)

  // Generate jwk for public endpoint
  const kid = uuid()
  const jwk = pemToJwk(keys.private, { use: `sig`, kid, alg: `RS256` }, `public`)
  const privateJwk = pemToJwk(keys.private, { use: `sig`, kid, alg: `RS256` }, `private`)

  // Push to jwks array
  jwks.keys.push(jwk)
  privateJwks.keys.push(privateJwk)
}

// Write jwks files
fs.writeFileSync(`keys/jwks.json`, JSON.stringify(jwks), `utf8`)
fs.writeFileSync(`keys/id_token.private.jwks.json`, JSON.stringify(privateJwks), `utf8`)

// Modify permissions
fs.chmodSync(`keys/jwks.json`, `600`)
fs.chmodSync(`keys/id_token.private.jwks.json`, `600`)

console.info(`Done creating keys!`)
