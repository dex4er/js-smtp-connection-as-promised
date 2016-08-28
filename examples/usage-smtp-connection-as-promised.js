#!/usr/bin/env node

const smtpConnectionAsPromised = require('../lib/smtp-connection-as-promised')

const options = {
  host: 'smtp.example.com'
}

const auth = {
  user: 'from@example.com',
  pass: 'secret'
}

const envelope = {
  from: 'from@example.com',
  to: 'to@example.net'
}

const message = "" +
  "From: from@example.com\n" +
  "To: to@example.net\n" +
  "Subject: test\n" +
  "\n" +
  "Test\n"

const connection = new smtpConnectionAsPromised(options)

connection.connect()
.then(() => {
  return connection.login(auth)
})
.then(() => {
  return connection.send(envelope, message)
})
.then((info) => {
  console.log(info)
  return connection.quit()
})
.catch((err) => {
  console.error(err)
  connection.close()
})
