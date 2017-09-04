'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

Feature('Test smtp-connection-as-promised module', () => {
  const { SMTPConnectionAsPromised } = require('../lib/smtp-connection-as-promised')
  const { SMTPServerAsPromised } = require('smtp-server-as-promised')

  const crlf = '\x0d\x0a'

  const from = 'sender@example.com'
  const to = 'recipient@example.net'
  const user = 'user'
  const pass = 'pass'

  const rfc2822Message = '' +
    'From: ' + from + crlf +
    'To: ' + to + crlf +
    'Subject: test' + crlf +
    crlf +
    'Test' + crlf +
    '.' + crlf

  function onAuth (auth, session) {
    return new Promise((resolve, reject) => {
      if (auth.method === 'PLAIN' && auth.username === user && auth.password === pass) {
        resolve({user: auth.username})
      } else {
        reject(new Error('Invalid username or password'))
      }
    })
  }

  Scenario('Send one mail', () => {
    let address
    let client
    let promise
    let server

    Given('SMTPServerAsPromised object', () => {
      server = new SMTPServerAsPromised({
        hideSTARTTLS: true,
        onAuth
      })
    })

    When('listen method is used', () => {
      promise = server.listen(0)
    })

    And('promise for server returns address object', () => {
      return promise.then(value => {
        address = value
      })
    })

    Then('port number should be correct', () => {
      address.port.should.be.above(1024).and.below(65535)
    })

    When('I create new SMTPConnectionAsPromised object', () => {
      client = new SMTPConnectionAsPromised({
        ignoreTLS: true,
        port: address.port,
        logger: false
      })
    })

    And('I connect to the server', () => {
      promise = client.connect()
    })

    Then('promise for connect method is fulfilled', () => {
      return promise.should.be.fulfilled
    })

    When('I login to the server', () => {
      promise = client.login({user, pass})
    })

    Then('promise for login method is fulfilled', () => {
      return promise.should.be.fulfilled
    })

    When('I send the message envelope and body', () => {
      promise = client.send({from, to}, rfc2822Message)
    })

    Then('promise for send method is fulfilled', done => {
      return promise.should.eventually.deep.equal({
        accepted: [ 'recipient@example.net' ],
        rejected: [],
        response: '250 OK: message queued'
      })
    })

    When('I quit the SMTP session', () => {
      promise = client.quit()
    })

    Then('promise for quit method is fulfilled', () => {
      return promise.should.eventually.be.false
    })

    After('close the client', () => {
      return client.close()
    })

    After('close the server', () => {
      return server.close()
    })
  })
})
