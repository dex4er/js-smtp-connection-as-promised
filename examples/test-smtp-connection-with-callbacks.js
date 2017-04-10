'use strict'

const SMTPConnection = require('nodemailer/lib/smtp-connection')
const fs = require('fs')
const mailcomposer = require('mailcomposer')

// Usage: node test-smtp-client.js host=localhost port=25 ignoreTLS=true user=u pass=p from=a@example.com to=b@example.net data=-
const options = Object.assign({
  opportunisticTLS: true,
  from: 'sender@example.com',
  to: 'recpient@example.net'
}, ...process.argv.slice(2).map(a => a.split('=')).map(([k, v]) => ({[k]: v})))
const {from, to, user, pass} = options

const message = options.data === '-' ? process.stdin
  : !options.data ? mailcomposer({from, to}).createReadStream()
  : fs.readFileSync(options.data)

const envelope = {from, to}

const connection = new SMTPConnection(options)

connection.on('error', console.error)

connection.connect(user && pass ? doLogin : doSend)

function doLogin () {
  connection.login({user, pass}, doSend)
}

function doSend () {
  connection.send(envelope, message, doQuit)
}

function doQuit (err, info) {
  if (err) {
    console.error(err)
    connection.close()
  } else {
    console.log(info)
    connection.quit()
  }
}
