/// <reference types="node" />

import MailComposer = require('nodemailer/lib/mail-composer')
import MimeNode = require('nodemailer/lib/mime-node')
import * as shared from 'nodemailer/lib/shared'
import SMTPConnection = require('nodemailer/lib/smtp-connection')
import { PromiseReadable } from 'promise-readable'
import { Readable } from 'stream'

export type SMTPConnectionAsPromisedOptions = SMTPConnection.Options

export class SMTPConnectionAsPromised {
  connection: SMTPConnection

  constructor (options: SMTPConnectionAsPromisedOptions)

  connect (): Promise<void>
  login (auth: SMTPConnection.AuthenticationCredentials | SMTPConnection.AuthenticationOAuth2 | SMTPConnection.Credentials): Promise<void>
  send (envelope: SMTPConnection.Envelope, message: string | Buffer | Readable | PromiseReadable<Readable>): Promise<SMTPConnection.SentMessageInfo>
  quit (): Promise<void>
  close (): Promise<void>
  reset (): Promise<void>
}
