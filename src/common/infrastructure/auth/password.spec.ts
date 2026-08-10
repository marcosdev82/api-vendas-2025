import { comparePassword, hashPassword } from './password'

describe('password helpers', () => {
  it('should hash a password and compare it successfully', async () => {
    const password = 'super-secret-password'
    const hash = await hashPassword(password)

    expect(hash).toContain('pbkdf2$')
    await expect(comparePassword(password, hash)).resolves.toBe(true)
  })

  it('should reject an invalid password', async () => {
    const password = 'super-secret-password'
    const hash = await hashPassword(password)

    await expect(comparePassword('wrong-password', hash)).resolves.toBe(false)
  })
})
