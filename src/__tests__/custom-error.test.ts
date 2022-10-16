import CustomError, { ITrace } from '../custom-error'

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

  describe('unwrap', () => {
    let customError: CustomError
    let trace: ITrace
    beforeEach(() => {
      customError = new CustomError(error)
      trace = { source: 'Controller', metadata: { id: 'test-id' } }
      customError.wrap(trace)
    })

    test('error tracing should be decrease when get unwrap', () => {
      customError.unwrap()
      expect(customError.error).toEqual(error)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(0)
      expect(customError.trace).toEqual([])
    })

    test('error tracing should be decrease when get unwrap (error with api code)', () => {
      const apiCode = 'XX-X-000'
      const customError = new CustomError(error, apiCode)
      customError.unwrap()
      expect(customError.trace).toHaveLength(0)
      expect(customError.trace).toEqual([])
    })

    test('error tracing should be decrease to two when unwrap more than one error', () => {
      const traceController = { source: 'Controller', metadata: { id: 'test-id' } }
      customError.wrap(traceController)
      customError.unwrap()
      expect(customError.error).toEqual(error)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(1)
      expect(customError.trace).toEqual([trace])
    })
  })

  describe('combine', () => {
    let customError: CustomError
    const metadata = { id: 'test-id' }
    beforeEach(() => {
      customError = new CustomError(error)
      const trace = { source: 'Controller', metadata }
      const traceService = { source: 'Service' }
      customError.wrap(trace).wrap(traceService)
    })

    test('error tracing should correct when trace combined', () => {
      const combined = customError.combine()
      expect(combined.message).toEqual('Service: Controller: error')
      expect(combined.metadata).toEqual(metadata)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(2)
    })

    test('error tracing should correct when trace combined with new tracing', () => {
      const repoTrace = { source: 'Repository' }
      const combined = customError.wrap(repoTrace).combine()
      expect(combined.message).toEqual('Repository: Service: Controller: error')
      expect(combined.metadata).toEqual(metadata)
      expect(customError.apiCode).not.toBeDefined()
      expect(customError.trace).toHaveLength(3)
    })

    test('error tracing should correct when trace combined (error with api code)', () => {
      const apiCode = 'XX-X-000'
      const repoTrace = { source: 'Repository' }
      const customError = new CustomError(error, apiCode).wrap(repoTrace)
      const combined = customError.combine()
      expect(combined.message).toEqual('Repository: error')
      expect(combined.metadata).toEqual({})
      expect(customError.apiCode).toEqual('XX-X-000')
      expect(customError.trace).toHaveLength(1)
    })

    test('error tracing should correct when error have not wrap yet', () => {
      const customError = new CustomError(error)
      const combined = customError.combine()
      expect(combined.message).toEqual('error')
      expect(combined.metadata).toEqual({})
      expect(customError.trace).toHaveLength(0)
    })
  })

  describe('toString', () => {
    let customError: CustomError
    const metadata = { id: 'test-id' }
    beforeEach(() => {
      customError = new CustomError(error)
      const trace = { source: 'Controller', metadata }
      const traceService = { source: 'Service' }
      customError.wrap(trace).wrap(traceService)
    })

    test('error tracing message should be correctly when called toString', () => {
      const message = customError.toString()
      expect(message).toEqual('Service: Controller: error')
    })

    test('error tracing message should be correctly when called toString with new tracing', () => {
      const repoTrace = { source: 'Repository' }
      const message = customError.wrap(repoTrace).toString()
      expect(message).toEqual('Repository: Service: Controller: error')
    })

    test('error tracing message should be correctly when called toString (error with api code)', () => {
      const apiCode = 'XX-X-000'
      const repoTrace = { source: 'Repository' }
      const customError = new CustomError(error, apiCode).wrap(repoTrace)
      const message = customError.toString()
      expect(message).toEqual('Repository: error')
    })

    test('error tracing message should be correctly when called toString when error have not wrap yet', () => {
      const customError = new CustomError(error)
      const message = customError.toString()
      expect(message).toEqual('error')
    })
  })
})
