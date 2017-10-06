import { PromiseReadable } from 'promise-readable'

import * as shared from 'nodemailer/lib/shared'

export { Logger, LoggerLevel } from 'nodemailer/lib/shared'

import MimeNode = require('nodemailer/lib/mime-node')

export type MimeNode = MimeNode

export type MimeNodeEnvelope = MimeNode.Envelope
export type MimeNodeHeaderKV = MimeNode.HeaderKV
export type MimeNodeOptions = MimeNode.Options

import MailComposer = require('nodemailer/lib/mail-composer')

export type MailComposer = MailComposer
export type MailComposerAddress = MailComposer.Address
export type MailComposerAttachment = MailComposer.Attachment
export type MailComposerAttachmentLike = MailComposer.AttachmentLike
export type MailComposerEnvelope = MailComposer.Envelope
export type MailComposerHeaders = MailComposer.Headers
export type MailComposerMail = MailComposer.Mail
export type MailComposerTextEncoding = MailComposer.TextEncoding

import SMTPConnection = require('nodemailer/lib/smtp-connection')

export type SMTPConnection = SMTPConnection

export type SMTPConnectionAuthenticationCredentials = SMTPConnection.AuthenticationCredentials
export type SMTPConnectionAuthenticationOAuth2 = SMTPConnection.AuthenticationOAuth2
export type SMTPConnectionCredentials = SMTPConnection.Credentials
export type SMTPConnectionDSNOptions = SMTPConnection.DSNOptions
export type SMTPConnectionEnvelope = SMTPConnection.Envelope
export type SMTPConnectionInformation = SMTPConnection.Information
export type SMTPConnectionOptions = SMTPConnection.Options
export type SMTPConnectionOAuth2 = SMTPConnection.OAuth2

export type SMTPError = SMTPConnection.SMTPError

export interface SMTPConnectionAsPromisedOptions extends SMTPConnectionOptions {}

export class SMTPConnectionAsPromised {
  connection: SMTPConnection

  constructor (options: SMTPConnectionAsPromisedOptions)

  connect (): Promise<void>
  login (auth: SMTPConnectionAuthenticationCredentials | SMTPConnectionAuthenticationOAuth2 | SMTPConnectionCredentials): Promise<void>
  send (envelope: SMTPConnection.Envelope, message: string | Buffer | NodeJS.ReadableStream | PromiseReadable<NodeJS.ReadableStream>): Promise<SMTPConnectionInformation>
  quit (): Promise<void>
  close (): Promise<void>
  reset (): Promise<void>
}
