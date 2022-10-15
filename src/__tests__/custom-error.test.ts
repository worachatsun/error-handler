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

  describe('wrap', () => {
    let customError: CustomError

    beforeEach(() => {
      customError = new CustomError(error)
    })

    test('error tracing should be increase when get wrap', () => {
      const trace = { source: 'Controller' }
      customError.wrap(trace)
      expect(customError.error).toEqual(error)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(1)
    })

    test('error tracing should be increase when get wrap', () => {
      const trace = { source: 'Controller', metadata: { id: 'test-id' } }
      customError.wrap(trace)
      expect(customError.error).toEqual(error)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(1)
      expect(customError.trace).toEqual([trace])
    })

    test('error tracing should be increase when get wrap (error with api code)', () => {
      const apiCode = 'XX-X-000'
      const customError = new CustomError(error, apiCode)
      const trace = { source: 'Controller' }
      customError.wrap(trace)
      expect(customError.error).toEqual(error)
      expect(customError.trace).toHaveLength(1)
    })

    test('error tracing should be increase to two when wrap twice', () => {
      const traceController = { source: 'Controller', metadata: { id: 'test-id' } }
      const traceService = { source: 'Service' }
      customError.wrap(traceController)
      customError.wrap(traceService)
      expect(customError.error).toEqual(error)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(2)
      expect(customError.trace).toEqual([traceController, traceService])
    })
  })
})
