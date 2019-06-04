/// <reference types="node" />
/// <reference types="nodemailer" />

import SMTPConnection from "nodemailer/lib/smtp-connection"
import {Readable} from "stream"

export interface SMTPError extends SMTPConnection.SMTPError {}

export interface SMTPConnectionAsPromisedOptions extends SMTPConnection.Options {}

export interface SMTPConnectionAuthenticationCredentials extends SMTPConnection.AuthenticationCredentials {}
export interface SMTPConnectionAuthenticationOAuth2 extends SMTPConnection.AuthenticationOAuth2 {}
export interface SMTPConnectionCredentials extends SMTPConnection.Credentials {}
export interface SMTPConnectionEnvelope extends SMTPConnection.Envelope {}
export interface SMTPConnectionSentMessageInfo extends SMTPConnection.SentMessageInfo {}

export class SMTPConnectionAsPromised {
  private static printableAscii(message: string): string {
    return Buffer.from(message)
      .toString()
      .replace(/[^\x20-\x7E]/g, "?")
  }

  private static printableAsciiError(error: SMTPError): SMTPError {
    if (error) {
      if (error.message) {
        error.message = SMTPConnectionAsPromised.printableAscii(error.message)
      }
      if (error.response) {
        error.response = SMTPConnectionAsPromised.printableAscii(error.response)
      }
    }
    return error
  }

  connection: SMTPConnection

  ended?: boolean
  secure?: boolean

  private endHandler?: () => void

  constructor(options: SMTPConnectionAsPromisedOptions) {
    this.connection = new SMTPConnection(options)
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        return reject(new Error("Cannot connect - SMTP connection is already ended."))
      }

      const endHandler = () => {
        this.connection.removeListener("error", errorHandler)
        reject(new Error("Cannot connect - SMTP connection is already ended."))
      }

      const errorHandler = (err: SMTPError) => {
        this.connection.removeListener("end", endHandler)
        reject(SMTPConnectionAsPromised.printableAsciiError(err))
      }

      const connectHandler = (err?: SMTPError) => {
        this.connection.removeListener("end", endHandler)
        this.connection.removeListener("error", errorHandler)
        if (err) {
          reject(err)
        } else {
          this.secure = this.connection.secure
          resolve()
        }
      }

      if (!this.endHandler) {
        this.ended = false

        this.endHandler = () => {
          this.ended = true
        }

        this.connection.once("end", this.endHandler)
      }

      this.connection.once("end", endHandler)
      this.connection.once("error", errorHandler)

      this.connection.connect(connectHandler)
    })
  }

  login(
    auth: SMTPConnectionAuthenticationCredentials | SMTPConnectionAuthenticationOAuth2 | SMTPConnectionCredentials,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        return reject(new Error("Cannot login - SMTP connection is already ended."))
      }

      const endHandler = () => {
        reject(new Error("Cannot login - SMTP connection is already ended."))
      }

      this.connection.once("end", endHandler)

      this.connection.login(auth, err => {
        this.connection.removeListener("end", endHandler)
        if (err) reject(SMTPConnectionAsPromised.printableAsciiError(err))
        else resolve()
      })
    })
  }

  send(envelope: SMTPConnectionEnvelope, message: string | Buffer | Readable): Promise<SMTPConnectionSentMessageInfo> {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        return reject(new Error("Cannot send - SMTP connection is already ended."))
      }

      const endHandler = () => {
        this.connection.removeListener("error", errorHandler)
        reject(new Error("Cannot send - SMTP connection is already ended."))
      }

      const errorHandler = (err: SMTPError) => {
        this.connection.removeListener("end", endHandler)
        reject(SMTPConnectionAsPromised.printableAsciiError(err))
      }

      this.connection.once("end", endHandler)
      this.connection.once("error", errorHandler)

      this.connection.send(envelope, message, (err: SMTPError | null, info: SMTPConnection.SentMessageInfo) => {
        this.connection.removeListener("end", endHandler)
        this.connection.removeListener("error", errorHandler)
        if (err) {
          reject(SMTPConnectionAsPromised.printableAsciiError(err))
        } else {
          info.response = SMTPConnectionAsPromised.printableAscii(info.response)
          resolve(info)
        }
      })
    })
  }

  reset(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        return reject(new Error("Cannot reset - SMTP connection is already ended."))
      }

      const endHandler = () => {
        this.connection.removeListener("error", errorHandler)
        reject(new Error("Cannot reset - SMTP connection is already ended."))
      }

      const errorHandler = (err: SMTPError) => {
        this.connection.removeListener("end", endHandler)
        reject(SMTPConnectionAsPromised.printableAsciiError(err))
      }

      this.connection.once("end", endHandler)
      this.connection.once("error", errorHandler)

      this.connection.reset((err?: SMTPError | null) => {
        this.connection.removeListener("end", endHandler)
        this.connection.removeListener("error", errorHandler)
        if (err) reject(SMTPConnectionAsPromised.printableAsciiError(err))
        else resolve()
      })
    })
  }

  quit(): Promise<void> {
    return new Promise(resolve => {
      const socket = this.connection._socket
      if (this.connection && !this.ended) {
        if (socket && !socket.destroyed) {
          socket.once("close", resolve)
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

  close(): Promise<void> {
    return new Promise(resolve => {
      const socket = this.connection._socket
      if (this.connection && !this.ended) {
        if (socket && !socket.destroyed) {
          socket.once("close", resolve)
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

  destroy(): Promise<void> {
    const cleanup = () => {
      this.ended = true
      if (this.endHandler) {
        this.connection.removeListener("end", this.endHandler)
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
