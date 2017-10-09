/// <reference types="node" />

declare module 'nodemailer/lib/mail-composer' {
  import { URL } from 'url'

  import MimeNode = require('nodemailer/lib/mime-node')

  namespace MailComposer {
    export type Headers = { [key: string]: string } | { key: string, value: string }[]

    export type TextEncoding = 'quoted-printable' | 'base64'

    export interface Address {
      name: string
      address: string
    }

    export interface AttachmentLike {
      /** String, Buffer or a Stream contents for the attachmentent */
      content?: string | Buffer | NodeJS.ReadableStream
      /** path to a file or an URL (data uris are allowed as well) if you want to stream the file instead of including it (better for larger attachments) */
      path?: string | URL
    }

    export interface Attachment extends AttachmentLike {
      /** filename to be reported as the name of the attached file, use of unicode is allowed. If you do not want to use a filename, set this value as false, otherwise a filename is generated automatically */
      filename?: string | false
      /** optional content id for using inline images in HTML message source. Using cid sets the default contentDisposition to 'inline' and moves the attachment into a multipart/related mime node, so use it only if you actually want to use this attachment as an embedded image */
      cid?: string
      /** If set and content is string, then encodes the content to a Buffer using the specified encoding. Example values: base64, hex, binary etc. Useful if you want to use binary attachments in a JSON formatted e-mail object */
      encoding?: string
      /** optional content type for the attachment, if not set will be derived from the filename property */
      contentType?: string
      /** optional transfer encoding for the attachment, if not set it will be derived from the contentType property. Example values: quoted-printable, base64 */
      contentTransferEncoding?: string
      /** optional content disposition type for the attachment, defaults to ‘attachment’ */
      contentDisposition?: string
      /** is an object of additional headers */
      headers?: Headers
      /** an optional value that overrides entire node content in the mime message. If used then all other options set for this node are ignored. */
      raw?: string | Buffer | NodeJS.ReadableStream | AttachmentLike
    }

    export interface Envelope extends MimeNode.Envelope {}

    export interface Mail {
      /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
      from?: string | Address
      /** An e-mail address that will appear on the Sender: field */
      sender?: string | Address
      /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
      to: string | Address | (string | Address)[]
      /** Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field */
      cc?: string | Address | (string | Address)[]
      /** Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field */
      bcc?: string | Address | (string | Address)[]
      /** An e-mail address that will appear on the Reply-To: field */
      replyTo?: string | Address
      /** The message-id this message is replying */
      inReplyTo?: string | Address
      /** Message-id list (an array or space separated string) */
      references?: string | string[]
      /** The subject of the e-mail */
      subject?: string
      /** The plaintext version of the message */
      text?: string | Buffer | NodeJS.ReadableStream | AttachmentLike
      /** The HTML version of the message */
      html?: string | Buffer | NodeJS.ReadableStream | AttachmentLike
      /** Apple Watch specific HTML version of the message, same usage as with text and html */
      watchHtml?: string | Buffer | NodeJS.ReadableStream | AttachmentLike
      /** iCalendar event, same usage as with text and html. Event method attribute defaults to ‘PUBLISH’ or define it yourself: {method: 'REQUEST', content: iCalString}. This value is added as an additional alternative to html or text. Only utf-8 content is allowed */
      icalEvent?: string | Buffer | NodeJS.ReadableStream | AttachmentLike
      /** An object or array of additional header fields */
      headers?: Headers
      /** An array of attachment objects */
      attachments?: Attachment[]
      /** An array of alternative text contents (in addition to text and html parts) */
      alternatives?: Attachment[]
      /** optional SMTP envelope, if auto generated envelope is not suitable */
      envelope?: MimeNode.Envelope
      /** optional Message-Id value, random value will be generated if not set */
      messageId?: string
      /** optional Date value, current UTC string will be used if not set */
      date?: string
      /** optional transfer encoding for the textual parts */
      encoding?: string
      /** if set then overwrites entire message output with this value. The value is not parsed, so you should still set address headers or the envelope value for the message to work */
      raw?: string
      /** set explicitly which encoding to use for text parts (quoted-printable or base64). If not set then encoding is detected from text content (mostly ascii means quoted-printable, otherwise base64) */
      textEncoding?: TextEncoding
      /** if set to true then fails with an error when a node tries to load content from URL */
      disableUrlAccess?: boolean
      /** if set to true then fails with an error when a node tries to load content from a file */
      disableFileAccess?: boolean
    }
  }

  /** Creates the object for composing a MimeNode instance out from the mail options */
  class MailComposer {
    message: MimeNode

    constructor (mail: MailComposer.Mail)

    /** Builds MimeNode instance */
    compile (): MimeNode

    /** List all attachments. Resulting attachment objects can be used as input for MimeNode nodes */
    getAttachments (findRelated: boolean): MailComposer.Attachment[]

    /** List alternatives. Resulting objects can be used as input for MimeNode nodes */
    getAlternatives (): MailComposer.Attachment[]
  }

  export = MailComposer
}
