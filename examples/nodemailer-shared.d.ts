declare module 'nodemailer/lib/shared' {
  type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

  interface Logger {
    level (level: LoggerLevel): void
    trace (...params: any[]): void
    debug (...params: any[]): void
    info (...params: any[]): void
    warn (...params: any[]): void
    error (...params: any[]): void
    fatal (...params: any[]): void
  }

  type Options = { [key: string]: string }
  type ErrValueCallback = (err: Error | null, value: any) => any

  export function parseConnectionUrl (url: string): object
  export function getLogger (options?: Options, defaults?: Options): Logger
  export function callbackPromise (resolve: (...args: any[]) => void, reject: (err: Error) => void): () => void
  export function resolveContent (data: object | any[], key: string | number, callback: ErrValueCallback): Promise<any>
  export function assign (target: object, ...sources: object[]): object
  export function encodeXText (str: string): string
  export function resolveStream (stream: NodeJS.ReadableStream, callback: ErrValueCallback): void
  export function createDefaultLogger (levels: LoggerLevel[]): Logger
}
