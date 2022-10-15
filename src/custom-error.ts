export interface ITrace {
  source?: string;
  metadata?: unknown;
}

export default class CustomError extends Error {
  trace: Array<ITrace> = [];
  error: Error;
  apiCode?: number;

  constructor(error: Error, apiCode?: number) {
    super(error?.message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.error = error;
    this.apiCode = apiCode;
  }

  wrap(trace: ITrace): CustomError {
    this.trace.push(trace);
    return this;
  }

  unwrap(): CustomError {
    this.trace.pop();
    return this;
  }

  combine(): { message: string; metadata: unknown; apiCode?: number } {
    let message = '';
    let metadata = {};

    const n = this.trace.length - 1;
    for (let i = n; i >= 0; i--) {
      const { source, metadata: metadataStack } = this.trace[i];
      message += `${source}: `;
      metadata = {
        ...metadata,
        ...(typeof metadataStack === 'object' ? metadataStack : {}),
      };
    }
    message += this.error?.message;

    return { message, metadata, apiCode: this.apiCode };
  }

  toString(): string {
    return (
      this.trace.reduce((prev, cur: ITrace) => `${cur.source}: ${prev}`, '') +
      this.error.message
    );
  }
}
