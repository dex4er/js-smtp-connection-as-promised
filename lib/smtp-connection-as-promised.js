'use strict'

const SMTPConnection = require('nodemailer/lib/smtp-connection')

class SMTPConnectionAsPromised {
  constructor (options) {
    options = options || {}
    this.connection = new SMTPConnection(options)
  }

  connect () {
    return new Promise((resolve, reject) => {
      const onceError = e => {
        reject(e)
      }

      const onceConnect = () => {
        this.connection.removeListener('error', onceError)
        this.secure = this.connection.secure
        resolve()
      }

      this.connection.once('error', onceError)
      this.connection.connect(onceConnect)
    })
  }

  login (auth) {
    return new Promise((resolve, reject) => {
      this.connection.login(auth, err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  send (envelope, message) {
    return new Promise((resolve, reject) => {
      this.connection.send(envelope, message, (err, info) => {
        if (err) reject(err)
        else resolve(info)
      })
    })
  }

  quit () {
    return new Promise(resolve => {
      const socket = this.connection._socket
      if (this.connection) {
        this.connection.quit()
      }
      if (socket && !socket.destroyed) {
        socket.once('close', resolve)
      } else {
        resolve(null)
      }
    })
  }

  close () {
    return new Promise(resolve => {
      const socket = this.connection._socket
      if (this.connection) {
        this.connection.close()
      }
      if (socket && !socket.destroyed) {
        socket.once('close', resolve)
      } else {
        resolve(null)
      }
    })
  }

  reset () {
    return new Promise((resolve, reject) => {
      this.connection.reset(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

SMTPConnectionAsPromised.SMTPConnectionAsPromised = SMTPConnectionAsPromised
SMTPConnectionAsPromised.default = SMTPConnectionAsPromised

module.exports = SMTPConnectionAsPromised
