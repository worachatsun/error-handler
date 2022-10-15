import CustomError from '../custom-error'

describe('CustomError', () => {
  const errorMessage = 'error'
  const error = new Error(errorMessage)

  describe('constructor', () => {
    test('error should be the same as input in constructor (error only)', () => {
      const customError = new CustomError(error)
      expect(customError.error).toEqual(error)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(0)
    })

    test('error should be the same as input in constructor (error with api code)', () => {
      const apiCode = 'XX-X-000'
      const customError = new CustomError(error, apiCode)
      expect(customError.error).toEqual(error)
      expect(customError.apiCode).toEqual(apiCode)
      expect(customError.trace).toHaveLength(0)
    })
  })
})
