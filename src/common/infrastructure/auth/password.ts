import crypto from 'crypto'

const ITERATIONS = 310000
const KEY_LENGTH = 32
const DIGEST = 'sha256'
const ALGORITHM = 'pbkdf2'

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, salt) => {
      if (err) return reject(err)

      crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (error, derivedKey) => {
        if (error) return reject(error)

        const encodedSalt = salt.toString('base64')
        const encodedKey = derivedKey.toString('base64')
        resolve(`${ALGORITHM}$${ITERATIONS}$${encodedSalt}$${encodedKey}`)
      })
    })
  })
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const [algorithm, iterations, encodedSalt, encodedKey] = hash.split('$')

  if (algorithm !== ALGORITHM || !iterations || !encodedSalt || !encodedKey) {
    return false
  }

  return new Promise((resolve, reject) => {
    const salt = Buffer.from(encodedSalt, 'base64')
    const expectedKey = Buffer.from(encodedKey, 'base64')

    crypto.pbkdf2(password, salt, Number(iterations), expectedKey.length, DIGEST, (error, derivedKey) => {
      if (error) return reject(error)
      resolve(crypto.timingSafeEqual(derivedKey, expectedKey))
    })
  })
}
