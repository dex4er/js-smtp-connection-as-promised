declare module 'nodemailer/lib/mail-composer' {
  import * as MimeNode from 'nodemailer/lib/mime-node'
  import * as url from 'url'

  namespace MailComposer {
    type Headers = { [key: string]: string } | { key: string, value: string }[]

    export interface Address {
      name: string
      address: string
    }

    export interface AttachmentLike {
      content?: string | Buffer | NodeJS.ReadStream  // String, Buffer or a Stream contents for the attachmentent
      path?: string | url.URL  // path to a file or an URL (data uris are allowed as well) if you want to stream the file instead of including it (better for larger attachments)
    }

    export interface Attachment extends AttachmentLike {
      filename?: string | false  // filename to be reported as the name of the attached file, use of unicode is allowed. If you do not want to use a filename, set this value as false, otherwise a filename is generated automatically
      cid?: string  // optional content id for using inline images in HTML message source. Using cid sets the default contentDisposition to 'inline' and moves the attachment into a multipart/related mime node, so use it only if you actually want to use this attachment as an embedded image
      encoding?: string  // If set and content is string, then encodes the content to a Buffer using the specified encoding. Example values: base64, hex, binary etc. Useful if you want to use binary attachments in a JSON formatted e-mail object
      contentType?: string  // optional content type for the attachment, if not set will be derived from the filename property
      contentTransferEncoding?: string  // optional transfer encoding for the attachment, if not set it will be derived from the contentType property. Example values: quoted-printable, base64
      contentDisposition?: string  // optional content disposition type for the attachment, defaults to ‘attachment’
      headers: Headers // is an object of additional headers
      raw?: string | Buffer | NodeJS.ReadStream | AttachmentLike  // an optional value that overrides entire node content in the mime message. If used then all other options set for this node are ignored.
    }

    export interface Envelope extends MimeNode.Envelope {}

    export interface Mail {
      from?: string | Address  // The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>'
      sender?: string | Address  // An e-mail address that will appear on the Sender: field
      to: string | Address | (string | Address)[]  // Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
      cc?: string | Address | (string | Address)[]  // Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field
      bcc?: string | Address | (string | Address)[]  // Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field
      replyTo?: string | Address  // An e-mail address that will appear on the Reply-To: field
      inReplyTo?: string | Address  // The message-id this message is replying
      references?: string | string[]  // Message-id list (an array or space separated string)
      subject?: string  // The subject of the e-mail
      text?: string | Buffer | NodeJS.ReadStream | AttachmentLike  // The plaintext version of the message
      html?: string | Buffer | NodeJS.ReadStream | AttachmentLike  // The HTML version of the message
      watchHtml?: string | Buffer | NodeJS.ReadStream | AttachmentLike  // Apple Watch specific HTML version of the message, same usage as with text and html
      icalEvent?: string | Buffer | NodeJS.ReadStream | AttachmentLike  // iCalendar event, same usage as with text and html. Event method attribute defaults to ‘PUBLISH’ or define it yourself: {method: 'REQUEST', content: iCalString}. This value is added as an additional alternative to html or text. Only utf-8 content is allowed
      headers?: Headers  // An object or array of additional header fields
      attachments?: Attachment[]  // An array of attachment objects
      alternatives?: Attachment[]  // An array of alternative text contents (in addition to text and html parts)
      envelope?: MimeNode.Envelope  // optional SMTP envelope, if auto generated envelope is not suitable
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
