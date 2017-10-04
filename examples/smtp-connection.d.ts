declare module 'nodemailer/lib/smtp-connection' {
  import * as events from 'events'
  import * as net from 'net'
  import * as tls from 'tls'
  import * as shared from 'nodemailer/lib/shared'
  import * as MimeNode from 'nodemailer/lib/mime-node'

  namespace SMTPConnection {
    type ms = number

    export interface Credentials {
      /** the username */
      user: string
      /** then password */
      pass: string
    }

    export interface OAuth2 {
      /** the username */
      user: string
      /** the OAuth2 Client ID */
      clientId: string
      /** the OAuth2 Client Secret */
      clientSecret: string
      /** the refresh token to generate new access token if needed */
      refreshToken: string
      /** the access token */
      accessToken: string
    }

    export interface AuthenticationCredentials {
      /** normal authentication object */
      credentials: Credentials
    }

    export interface AuthenticationOAuth2 {
      /**  if set then forces smtp-connection to use XOAuth2 for authentication */
      oauth2: OAuth2
    }

    export interface DSNOptions {
      /** return either the full message ‘FULL’ or only headers ‘HDRS’ */
      ret?: 'Full' | 'HDRS'
      /** sender’s ‘envelope identifier’ for tracking */
      envid?: string
      /** when to send a DSN. Multiple options are OK - array or comma delimited. NEVER must appear by itself. */
      notify?: 'NEVER' | 'SUCCESS' | 'FAILURE' | 'DELAY' | ('NEVER' | 'SUCCESS' | 'FAILURE' | 'DELAY')[]
      /** original recipient */
      orcpt?: string
    }

    export interface Envelope extends MimeNode.Envelope {
      /** an optional value of the predicted size of the message in bytes. This value is used if the server supports the SIZE extension (RFC1870) */
      size?: number
      /** if true then inform the server that this message might contain bytes outside 7bit ascii range */
      use8BitMime?: boolean
      /** the dsn options */
      dsn?: DSNOptions
    }

    export class SMTPError extends Error {
      /** string code identifying the error, for example ‘EAUTH’ is returned when authentication */
      code: string
      /** the last response received from the server (if the error is caused by an error response from the server) */
      response: string
      /** the numeric response code of the response string (if available) */
      responseCode: string
    }

    export interface Information {
      /** an array of accepted recipient addresses. Normally this array should contain at least one address except when in LMTP mode. In this case the message itself might have succeeded but all recipients were rejected after sending the message. */
      accepted: string[]
      /** an array of rejected recipient addresses. This array includes both the addresses that were rejected before sending the message and addresses rejected after sending it if using LMTP */
      rejected: string[]
      /** if some recipients were rejected then this property holds an array of error objects for the rejected recipients */
      rejectedErrors?: SMTPError[]
      /** the last response received from the server */
      response: string
    }

    export interface Options {
      /** the hostname or IP address to connect to (defaults to ‘localhost’) */
      host?: string
      /** the port to connect to (defaults to 25 or 465) */
      port?: number
      /** defines if the connection should use SSL (if true) or not (if false) */
      secure?: boolean
      /** turns off STARTTLS support if true */
      ignoreTLS?: boolean
      /** forces the client to use STARTTLS. Returns an error if upgrading the connection is not possible or fails. */
      requireTLS?: boolean
      /** tries to use STARTTLS and continues normally if it fails */
      opportunisticTLS?: boolean
      /** optional hostname of the client, used for identifying to the server */
      name?: string
      /** the local interface to bind to for network connections */
      localAddress?: string
      /** how many milliseconds to wait for the connection to establish */
      connectionTimeout?: ms
      /** how many milliseconds to wait for the greeting after connection is established */
      greetingTimeout?: ms
      /** how many milliseconds of inactivity to allow */
      socketTimeout?: ms
      /** optional bunyan compatible logger instance. If set to true then logs to console. If value is not set or is false then nothing is logged */
      logger?: shared.Logger | boolean
      /** if set to true, then logs SMTP traffic without message content */
      transactionLog?: boolean
      /** if set to true, then logs SMTP traffic and message content, otherwise logs only transaction events */
      debug?: boolean
      /** defines preferred authentication method, e.g. ‘PLAIN’ */
      authMethod?: string
      /** defines additional options to be passed to the socket constructor, e.g. {rejectUnauthorized: true} */
      tls?: tls.ConnectionOptions
      /** initialized socket to use instead of creating a new one */
      socket?: net.Socket
      /** connected socket to use instead of creating and connecting a new one. If secure option is true, then socket is upgraded from plaintext to ciphertext */
      connection?: net.Socket
    }
  }

  /** Generates a SMTP connection object */
  class SMTPConnection extends events.EventEmitter {
    id: string
    _socket: net.Socket

    constructor (options: SMTPConnection.Options)

    /** Creates a connection to a SMTP server and sets up connection listener */
    connect (callback: () => void): void
    /** Sends QUIT */
    quit (): void
    /** Closes the connection to the server */
    close (): void
    /** Authenticate user */
    login (auth: SMTPConnection.AuthenticationCredentials | SMTPConnection.AuthenticationOAuth2 | SMTPConnection.Credentials, callback: (err: SMTPConnection.SMTPError | null) => void): void
    /** Sends a message */
    send (envelope: SMTPConnection.Envelope, message: string | Buffer | NodeJS.WritableStream, callback: (err: SMTPConnection.SMTPError | null, info?: SMTPConnection.Information) => void): void
    /** Resets connection state */
    reset (callback: (err: Error | null) => void): void

    addListener (event: 'connect', listener: () => void): this
    addListener (event: 'error', listener: (err: SMTPConnection.SMTPError) => void): this
    addListener (event: 'end', listener: () => void): this

    emit (event: 'connect'): boolean
    emit (event: 'error', error: Error): boolean
    emit (event: 'end'): boolean

    on (event: 'connect', listener: () => void): this
    on (event: 'error', listener: (err: SMTPConnection.SMTPError) => void): this
    on (event: 'end', listener: () => void): this

    once (event: 'connect', listener: () => void): this
    once (event: 'error', listener: (err: SMTPConnection.SMTPError) => void): this
    once (event: 'end', listener: () => void): this

    prependListener (event: 'connect', listener: () => void): this
    prependListener (event: 'error', listener: (err: SMTPConnection.SMTPError) => void): this
    prependListener (event: 'end', listener: () => void): this

    prependOnceListener (event: 'connect', listener: () => void): this
    prependOnceListener (event: 'error', listener: (err: SMTPConnection.SMTPError) => void): this
    prependOnceListener (event: 'end', listener: () => void): this

    listeners (event: 'connect'): (() => void)[]
    listeners (event: 'error'): ((err: SMTPConnection.SMTPError) => void)[]
    listeners (event: 'end'): (() => void)[]
  }

  export = SMTPConnection
}
