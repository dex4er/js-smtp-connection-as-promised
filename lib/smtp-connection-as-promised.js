'use strict'

const SMTPConnection = require('nodemailer/lib/smtp-connection')

class SMTPConnectionAsPromised {
  constructor (options) {
    options = options || {}
    this.connection = new SMTPConnection(options)
  }

  connect () {
    return new Promise((resolve, reject) => {
      const endHandler = () => {
        this.connection.removeListener('error', errorHandler)
        reject(new Error('Cannot connect - smtp connection is already ended.'))
      }

      const errorHandler = (err) => {
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
      this.connection.connect(connectHandler)
    })
  }

  login (auth) {
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

  send (envelope, message) {
    return new Promise((resolve, reject) => {
      const endHandler = () => {
        this.connection.removeListener('error', errorHandler)
        reject(new Error('Cannot send - smtp connection is already ended.'))
      }

      const errorHandler = (err) => {
        this.connection.removeListener('end', endHandler)
        reject(err)
      }

      this.connection.once('end', endHandler)
      this.connection.once('error', errorHandler)

      this.connection.send(envelope, message, (err, info) => {
        this.connection.removeListener('end', endHandler)
        this.connection.removeListener('error', errorHandler)
        if (err) reject(err)
        else resolve(info)
      })
    })
  }

  quit () {
    return new Promise((resolve) => {
      const socket = this.connection._socket
      if (this.connection && !this.connection._destroyed) {
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

  close () {
    return new Promise((resolve) => {
      const socket = this.connection._socket
      if (this.connection && !this.connection._destroyed) {
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

  reset () {
    return new Promise((resolve, reject) => {
      const endHandler = () => {
        this.connection.removeListener('error', errorHandler)
        reject(new Error('Cannot send - smtp connection is already ended.'))
      }

      const errorHandler = (err) => {
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
}

SMTPConnectionAsPromised.SMTPConnectionAsPromised = SMTPConnectionAsPromised

module.exports = SMTPConnectionAsPromised
