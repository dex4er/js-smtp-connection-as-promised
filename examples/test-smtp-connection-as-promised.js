'use strict'

const { SMTPConnectionAsPromised } = require('../lib/smtp-connection-as-promised')

const fs = require('fs')
const mailcomposer = require('mailcomposer')

async function main () {
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

  const connection = new SMTPConnectionAsPromised(options)

  try {
    await connection.connect()
    if (user && pass) {
      await connection.login({user, pass})
    }
    const info = await connection.send(envelope, message)
    console.log(info)
    await connection.quit()
  } catch (e) {
    console.error(e)
    connection.close()
  }
}

main().catch(console.error)
