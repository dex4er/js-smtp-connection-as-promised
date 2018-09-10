/// <reference types="node" />
/// <reference types="nodemailer" />

import SMTPConnection from 'nodemailer/lib/smtp-connection'
import { Readable } from 'stream'

export interface SMTPConnectionAsPromisedOptions extends SMTPConnection.Options {}

export interface SMTPConnectionAuthenticationCredentials extends SMTPConnection.AuthenticationCredentials {}
export interface SMTPConnectionAuthenticationOAuth2 extends SMTPConnection.AuthenticationOAuth2 {}
export interface SMTPConnectionCredentials extends SMTPConnection.Credentials {}
export interface SMTPConnectionEnvelope extends SMTPConnection.Envelope {}
export interface SMTPConnectionSentMessageInfo extends SMTPConnection.SentMessageInfo {}

export class SMTPConnectionAsPromised {
  connection: SMTPConnection
  secure?: boolean

  protected ended?: boolean
  protected endHandler?: () => void

  constructor (options: SMTPConnectionAsPromisedOptions) {
    this.connection = new SMTPConnection(options)
  }

  connect (): Promise<void> {
    return new Promise((resolve, reject) => {
      const endHandler = () => {
        this.connection.removeListener('error', errorHandler)
        reject(new Error('Cannot connect - smtp connection is already ended.'))
      }

      const errorHandler = (err: Error) => {
        this.connection.removeListener('end', endHandler)
        reject(err)
      }

      const connectHandler = () => {
        this.connection.removeListener('error', errorHandler)
        this.connection.removeListener('end', endHandler)
        this.connection.removeListener('error', errorHandler)
        this.secure = this.connection.secure
        resolve()
      }

      this.connection.once('end', endHandler)
      this.connection.once('error', errorHandler)

      if (!this.endHandler) {
        this.ended = false

        this.endHandler = () => {
          this.ended = true
        }

        this.connection.once('end', this.endHandler)
      }

      this.connection.connect(connectHandler)
    })
  }

  login (auth: SMTPConnectionAuthenticationCredentials | SMTPConnectionAuthenticationOAuth2 | SMTPConnectionCredentials): Promise<void> {
    return new Promise((resolve, reject) => {
      const endHandler = () => {
        reject(new Error('Cannot send - smtp connection is already ended.'))
      }

      this.connection.once('end', endHandler)

      this.connection.login(auth, (err) => {
        this.connection.removeListener('end', endHandler)
        if (err) reject(err)
        else resolve()
      })
    })
  }

  send (envelope: SMTPConnectionEnvelope, message: string | Buffer | Readable): Promise<SMTPConnectionSentMessageInfo> {
    return new Promise((resolve, reject) => {
      const endHandler = () => {
        this.connection.removeListener('error', errorHandler)
        reject(new Error('Cannot send - smtp connection is already ended.'))
      }

      const errorHandler = (err: Error) => {
        this.connection.removeListener('end', endHandler)
        reject(err)
      }

      this.connection.once('end', endHandler)
      this.connection.once('error', errorHandler)

      // TODO: wait for https://github.com/DefinitelyTyped/DefinitelyTyped/pull/28747/
      this.connection.send(envelope, message as any, (err: Error | null, info: SMTPConnection.SentMessageInfo) => {
        this.connection.removeListener('end', endHandler)
        this.connection.removeListener('error', errorHandler)
        if (err) reject(err)
        else resolve(info)
      })
    })
  }

  quit (): Promise<void> {
    return new Promise((resolve) => {
      const socket = this.connection._socket
      if (this.connection && !this.ended) {
        if (socket && !socket.destroyed) {
          socket.once('close', resolve)
          this.connection.quit()
        } else {
          this.connection.close()
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  close (): Promise<void> {
    return new Promise((resolve) => {
      const socket = this.connection._socket
      if (this.connection && !this.ended) {
        if (socket && !socket.destroyed) {
          socket.once('close', resolve)
          this.connection.close()
        } else {
          this.connection.close()
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  reset (): Promise<void> {
    return new Promise((resolve, reject) => {
      const endHandler = () => {
        this.connection.removeListener('error', errorHandler)
        reject(new Error('Cannot send - smtp connection is already ended.'))
      }

      const errorHandler = (err: Error) => {
        this.connection.removeListener('end', endHandler)
        reject(err)
      }

      this.connection.once('end', endHandler)
      this.connection.once('error', errorHandler)

      this.connection.reset((err) => {
        this.connection.removeListener('end', endHandler)
        this.connection.removeListener('error', errorHandler)
        if (err) reject(err)
        else resolve()
      })
    })
  }

  destroy (): Promise<void> {
    const cleanup = () => {
      this.ended = true
      if (this.endHandler) {
        this.connection.removeListener('end', this.endHandler)
        this.endHandler = undefined
      }
    }
    if (!this.ended) {
      return this.close().then(() => cleanup())
    } else {
      cleanup()
      return Promise.resolve()
    }
  }
}

export default SMTPConnectionAsPromised
