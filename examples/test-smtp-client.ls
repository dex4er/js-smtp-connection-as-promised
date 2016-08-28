#!/usr/bin/env lsc

require 'any-promise/register/bluebird'

require! {
  'bluebird-co': {co}
  'mailcomposer'
  'prelude-ls': {map, each, floor, pairs-to-obj, split}
  '../lib/smtp-connection-as-promised'
}

const options = (process.argv.slice(2) |> map (split '=') |> each ((a) !-> if not isNaN a.1 then a.1 = Number a.1 else if a.1 is 'true' then a.1 = true) |> pairs-to-obj)

const message = switch options.data
  case '-' then process.stdin
  case undefined then do ->
    mail = mailcomposer do
      from: options.from
      to: options.to
    mail.createReadStream!
  default fs.readFileSync options.data

const envelope = options{from, to}

connection = new smtp-connection-as-promised options

co ->*
  yield connection.connect!

  if options.user and options.pass
    yield connection.login options.user, options.pass

  info = yield connection.send envelope, message

  console.log info

  yield connection.quit!

.catch (err) ->
  console.error err
  connection.close!
