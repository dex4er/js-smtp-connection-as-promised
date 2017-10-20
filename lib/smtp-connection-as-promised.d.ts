/// <reference types="node" />

import MailComposer = require('nodemailer/lib/mail-composer')
import MimeNode = require('nodemailer/lib/mime-node')
import * as shared from 'nodemailer/lib/shared'
import SMTPConnection = require('nodemailer/lib/smtp-connection')
import { PromiseReadable } from 'promise-readable'
import { Readable } from 'stream'

export type SMTPConnectionAsPromisedOptions = SMTPConnection.Options

export type SMTPConnectionAuthenticationCredentials = SMTPConnection.AuthenticationCredentials
export type SMTPConnectionAuthenticationOAuth2 = SMTPConnection.AuthenticationOAuth2
export type SMTPConnectionCredentials = SMTPConnection.Credentials
export type SMTPConnectionEnvelope = SMTPConnection.Envelope
export type SMTPConnectionSentMessageInfo = SMTPConnection.SentMessageInfo

export class SMTPConnectionAsPromised {
  connection: SMTPConnection

  constructor (options: SMTPConnectionAsPromisedOptions)

  connect (): Promise<void>
  login (auth: SMTPConnectionAuthenticationCredentials | SMTPConnectionAuthenticationOAuth2 | SMTPConnectionCredentials): Promise<void>
  send (envelope: SMTPConnectionEnvelope, message: string | Buffer | Readable | PromiseReadable<Readable>): Promise<SMTPConnectionSentMessageInfo>
  quit (): Promise<void>
  close (): Promise<void>
  reset (): Promise<void>
}
