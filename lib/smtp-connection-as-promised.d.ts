import * as events from 'events'
import * as net from 'net'
import * as tls from 'tls'

import * as stream from 'stream'

export interface MimeNodeAddresses {
  from?: string[]
  sender?: string[]
  'reply-to'?: string[]
  to?: string[]
  cc?: string[]
  bcc?: string[]
}

export interface MimeNodeEnvelope {
  /** includes an address object or is set to false */
  from: string | false
  /** includes an array of address objects */
  to: string[]
}

export interface MimeNodeOptions {
  /** root node for this tree */
  rootNode?: MimeNode
  /** immediate parent for this node */
  parentNode?: MimeNode
  /** filename for an attachment node */
  filename?: string
  /** shared part of the unique multipart boundary */
  baseBoundary?: string
  /** If true, do not exclude Bcc from the generated headers */
  keepBcc?: boolean
  /** either 'Q' (the default) or 'B' */
  textEncoding: 'B' | 'Q'
}

/**
 * Creates a new mime tree node. Assumes 'multipart/*' as the content type
 * if it is a branch, anything else counts as leaf. If rootNode is missing from
 * the options, assumes this is the root.
 */
export class MimeNode {
  constructor (contentType: string, options: MimeNodeOptions)

  /** Creates and appends a child node.Arguments provided are passed to MimeNode constructor */
  createChild (contentType: string, options: MimeNodeOptions): MimeNode

  /** Appends an existing node to the mime tree. Removes the node from an existing tree if needed */
  appendChild (childNode: MimeNode): MimeNode

  /** Replaces current node with another node */
  replace (node: MimeNode): MimeNode

  /** Removes current node from the mime tree */
  remove (): this

  /**
   * Sets a header value. If the value for selected key exists, it is overwritten.
   * You can set multiple values as well by using [{key:'', value:''}] or
   * {key: 'value'} as the first argument.
   */
  setHeader (key: string, value: string): this
  setHeader (headers: { [key: string]: string}): this
  setHeader (headers: { key: string, value: string}[]): this

  /**
   * Adds a header value. If the value for selected key exists, the value is appended
   * as a new field and old one is not touched.
   * You can set multiple values as well by using [{key:'', value:''}] or
   * {key: 'value'} as the first argument.
   */
  addHeader (key: string, value: string): this
  addHeader (headers: { [key: string]: string}): this
  addHeader (headers: { key: string, value: string}[]): this

  /** Retrieves the first mathcing value of a selected key */
  getHeader (key: string): string

  /**
   * Sets body content for current node. If the value is a string, charset is added automatically
   * to Content-Type (if it is text/*). If the value is a Buffer, you need to specify
   * the charset yourself
   */
  setContent (content: string | Buffer | NodeJS.ReadStream): this

  /** Generate the message and return it with a callback */
  build (callback: (err: Error | null, buf: Buffer) => void): void

  getTransferEncoding (): string

  /** Builds the header block for the mime node. Append \r\n\r\n before writing the content */
  buildHeaders (): string

  /**
   * Streams the rfc2822 message from the current node. If this is a root node,
   * mandatory header fields are set if missing (Date, Message-Id, MIME-Version)
   */
  createReadStream (options?: stream.ReadableOptions): NodeJS.ReadStream

  /**
   * Appends a transform stream object to the transforms list. Final output
   * is passed through this stream before exposing
   */
  transform (transform: stream.Transform): void

  /**
   * Appends a post process function. The functon is run after transforms and
   * uses the following syntax
   *
   *   processFunc(input) -> outputStream
   */
  processFunc (processFunc: (outputStream: NodeJS.ReadStream) => NodeJS.ReadStream): void

  stream (outputStream: NodeJS.ReadStream, options: stream.ReadableOptions, done: (err: Error | null) => void): void

  /** Sets envelope to be used instead of the generated one */
  setEnvelope (envelope: SMTPConnectionEnvelope): this

  /** Generates and returns an object with parsed address fields */
  getAddresses (): MimeNodeAddresses

  /** Generates and returns SMTP envelope with the sender address and a list of recipients addresses */
  getEnvelope (): MimeNodeEnvelope

  /** Sets pregenerated content that will be used as the output of this node */
  setRaw (raw: string | Buffer | NodeJS.ReadStream): this
}

export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface Logger {
  level (level: LoggerLevel): void
  trace (...params: any[]): void
  debug (...params: any[]): void
  info (...params: any[]): void
  warn (...params: any[]): void
  error (...params: any[]): void
  fatal (...params: any[]): void
}

declare namespace shared {
  type Options = { [key: string]: string }
  type ErrValueCallback = (err: Error | null, value: any) => any

  function parseConnectionUrl (url: string): object
  function getLogger (options?: Options, defaults?: Options): Logger
  function callbackPromise (resolve: (...args: any[]) => void, reject: (err: Error) => void): () => void
  function resolveContent (data: object | any[], key: string | number, callback: ErrValueCallback): Promise<any>
  function assign (target: object, ...sources: object[]): object
  function encodeXText (str: string): string
  function resolveStream (stream: NodeJS.ReadableStream, callback: ErrValueCallback): void
  function createDefaultLogger (levels: LoggerLevel[]): Logger
}

type ms = number

export interface SMTPConnectionCredentials {
  /** the username */
  user: string
  /** then password */
  pass: string
}

export interface SMTPConnectionOAuth2 {
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

export interface SMTPConnectionAuthenticationCredentials {
  /** normal authentication object */
  credentials: SMTPConnectionCredentials
}

export interface SMTPConnectionAuthenticationOAuth2 {
  /**  if set then forces smtp-connection to use XOAuth2 for authentication */
  oauth2: SMTPConnectionOAuth2
}

export interface SMTPConnectionDSNOptions {
  /** return either the full message ‘FULL’ or only headers ‘HDRS’ */
  ret?: 'Full' | 'HDRS'
  /** sender’s ‘envelope identifier’ for tracking */
  envid?: string
  /** when to send a DSN. Multiple options are OK - array or comma delimited. NEVER must appear by itself. */
  notify?: 'NEVER' | 'SUCCESS' | 'FAILURE' | 'DELAY' | ('NEVER' | 'SUCCESS' | 'FAILURE' | 'DELAY')[]
  /** original recipient */
  orcpt?: string
}

export interface SMTPConnectionEnvelope extends MimeNodeEnvelope {
  /** an optional value of the predicted size of the message in bytes. This value is used if the server supports the SIZE extension (RFC1870) */
  size?: number
  /** if true then inform the server that this message might contain bytes outside 7bit ascii range */
  use8BitMime?: boolean
  /** the dsn options */
  dsn?: SMTPConnectionDSNOptions
}

export class SMTPError extends Error {
  /** string code identifying the error, for example ‘EAUTH’ is returned when authentication */
  code: string
  /** the last response received from the server (if the error is caused by an error response from the server) */
  response: string
  /** the numeric response code of the response string (if available) */
  responseCode: string
}

export interface SMTPConnectionInformation {
  /** an array of accepted recipient addresses. Normally this array should contain at least one address except when in LMTP mode. In this case the message itself might have succeeded but all recipients were rejected after sending the message. */
  accepted: string[]
  /** an array of rejected recipient addresses. This array includes both the addresses that were rejected before sending the message and addresses rejected after sending it if using LMTP */
  rejected: string[]
  /** if some recipients were rejected then this property holds an array of error objects for the rejected recipients */
  rejectedErrors?: SMTPError[]
  /** the last response received from the server */
  response: string
}

export interface SMTPConnectionOptions {
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
  logger?: Logger | boolean
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

/** Generates a SMTP connection object */
export class SMTPConnection extends events.EventEmitter {
  id: string
  _socket: net.Socket

  constructor (options: SMTPConnectionOptions)

  /** Creates a connection to a SMTP server and sets up connection listener */
  connect (callback: () => void): void
  /** Sends QUIT */
  quit (): void
  /** Closes the connection to the server */
  close (): void
  /** Authenticate user */
  login (auth: SMTPConnectionAuthenticationCredentials | SMTPConnectionAuthenticationOAuth2 | SMTPConnectionCredentials, callback: (err: SMTPError | null) => void): void
  /** Sends a message */
  send (envelope: SMTPConnectionEnvelope, message: string | Buffer | NodeJS.WritableStream, callback: (err: SMTPError | null, info?: SMTPConnectionInformation) => void): void
  /** Resets connection state */
  reset (callback: (err: Error | null) => void): void

  addListener (event: 'connect', listener: () => void): this
  addListener (event: 'error', listener: (err: SMTPError) => void): this
  addListener (event: 'end', listener: () => void): this

  emit (event: 'connect'): boolean
  emit (event: 'error', error: Error): boolean
  emit (event: 'end'): boolean

  on (event: 'connect', listener: () => void): this
  on (event: 'error', listener: (err: SMTPError) => void): this
  on (event: 'end', listener: () => void): this

  once (event: 'connect', listener: () => void): this
  once (event: 'error', listener: (err: SMTPError) => void): this
  once (event: 'end', listener: () => void): this

  prependListener (event: 'connect', listener: () => void): this
  prependListener (event: 'error', listener: (err: SMTPError) => void): this
  prependListener (event: 'end', listener: () => void): this

  prependOnceListener (event: 'connect', listener: () => void): this
  prependOnceListener (event: 'error', listener: (err: SMTPError) => void): this
  prependOnceListener (event: 'end', listener: () => void): this

  listeners (event: 'connect'): (() => void)[]
  listeners (event: 'error'): ((err: SMTPError) => void)[]
  listeners (event: 'end'): (() => void)[]
}

import { PromiseReadable } from 'promise-readable'

export interface SMTPConnectionAsPromisedOptions extends SMTPConnectionOptions {}

export class SMTPConnectionAsPromised {
  connection: SMTPConnection

  constructor (options: SMTPConnectionAsPromisedOptions)

  connect (): Promise<void>
  login (auth: SMTPConnectionAuthenticationCredentials | SMTPConnectionAuthenticationOAuth2 | SMTPConnectionCredentials): Promise<void>
  send (envelope: SMTPConnectionEnvelope, message: string | Buffer | NodeJS.ReadStream | PromiseReadable<NodeJS.ReadStream>): Promise<SMTPConnectionInformation>
  quit (): Promise<void>
  close (): Promise<void>
  reset (): Promise<void>
}
