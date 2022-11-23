# error-handler

[![npm version](https://badge.fury.io/js/pursue-error.svg)](https://www.npmjs.com/package/pursue-error)

In this project, we'll design an error log format as well as the protocol we'll use to communicate when our system encounters a problem. To manage error log messages, HTTP code, API error code, and trace, we developed the CustomError class. If you want to view a demonstration of what we've done, follow me:

```ts
try {
  ...
  if (!error)
    throw new NotFoundException(
      [Error message],
    )
  ...
} catch (error) {
  const trace = {
    source: "Function name (Ser)",
  }
  if (error instanceof CustomError) throw error.wrap(trace)
  throw new CustomError(error as Error).wrap(trace)
}
```

### Example result

```json
{
    "statusCode": 404,
    "timestamp": "2022-10-06T10:48:41.519Z",
    "path": "/entity/manage/1",
    "error": {
        "message": "Controller (Con): Service (Ser): Error message",
        "metadata": {
            "userId": "1"
        }
    }
}
```
