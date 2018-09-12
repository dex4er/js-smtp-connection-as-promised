#!/usr/bin/env node

'use strict'

const fs = require('fs')
const MailComposer = require('nodemailer/lib/mail-composer')

const SMTPConnection = require('nodemailer/lib/smtp-connection')

// Usage: node test-smtp-client.js host=localhost port=25 ignoreTLS=true user=u pass=p from=a@example.com to=b@example.net data=-
const defaultOptions = {
  opportunisticTLS: true,
  from: 'sender@example.com',
  to: 'recpient@example.net'
}
const userOptions = Object.assign({}, ...process.argv.slice(2).map((a) => a.split('=')).map(([k, v]) => ({ [k]: v })))

const options = { ...defaultOptions, ...userOptions }
const { from, to, user, pass } = options

const message = options.data === '-' ? process.stdin
  : !options.data ? new MailComposer({ from, to }).compile().createReadStream()
    : fs.readFileSync(options.data)

const envelope = { from, to: [to] }

const connection = new SMTPConnection(options)

connection.on('error', console.error)

connection.connect(user && pass ? doLogin : doSend)

function doLogin (err) {
  if (err) {
    doClose(err)
  } else {
    connection.login({ user, pass }, doSend)
  }
}

function doSend (err) {
  if (err) {
    doClose(err)
  } else {
    connection.send(envelope, message, doQuit)
  }
}

function doQuit (err, info) {
  if (err) {
    doClose(err)
  } else {
    console.info(info)
    connection.quit()
  }
}

function doClose (err) {
  if (err) {
    console.error(err)
  }
  connection.close()
}
