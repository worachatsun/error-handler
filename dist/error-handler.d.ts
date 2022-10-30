/**
 * The widget class
 * @beta
 */
export declare class CustomError extends Error {
  trace: Array<ITrace>
  error: Error
  apiCode?: string
  constructor(error: Error, apiCode?: string)
  wrap(trace: ITrace): CustomError
  unwrap(): CustomError
  combine(): ICombineResponse
  toString(): string
}

declare type ICombineResponse = {
  message: string
  metadata: unknown
  apiCode?: string
}

declare type ITrace = {
  source?: string
  metadata?: unknown
}

export {}
