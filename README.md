# smtp-connection-as-promised

<!-- markdownlint-disable MD013 -->
[![Build Status](https://secure.travis-ci.org/dex4er/js-smtp-connection-as-promised.svg)](http://travis-ci.org/dex4er/js-smtp-connection-as-promised) [![Coverage Status](https://coveralls.io/repos/github/dex4er/js-smtp-connection-as-promised/badge.svg)](https://coveralls.io/github/dex4er/js-smtp-connection-as-promised) [![npm](https://img.shields.io/npm/v/smtp-connection-as-promised.svg)](https://www.npmjs.com/package/smtp-connection-as-promised)
<!-- markdownlint-enable MD013 -->

This module provides promisified version of `smtp-connection` from
[`nodemailer`](https://www.npmjs.com/package/nodemailer) module. The API is the
same as for `smtp-connection`, except that all methods return
[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
objects.

## Requirements

This module requires Node >= 5. For Node < 6 `--harmony` flag is required.

## Installation

```shell
npm install smtp-connection-as-promised
```

_Typescript:_

```shell
npm install smtp-connection-as-promised @types/node @types/nodemailer
```

## Usage

`smtp-connection-as-promised` can be used like standard `smtp-connection`
module:

```js
const SMTPConnectionAsPromised = require('smtp-connection-as-promised')
```

_Typescript:_

```ts
import SMTPConnectionAsPromised from 'smtp-connection-as-promised'
```

### constructor

```js
const connection = new SMTPConnectionAsPromised(options)
```

Create new SMTPConnection instance. Options are the same as for original
`smtp-connection` constructor.

_Example:_

```js
const connection = new SMTPConnectionAsPromised({
  opportunisticTLS: true,
  host: 'smtp.example.com',
  port: 25
})
```

### connect

```js
await connection.connect()
console.log(connection.secure)
```

Establish the connection and set the `secure` property.

### login

```js
await connection.login(auth)
```

Login to the server if requires authentication.

`auth` is the authentication object with `user`, `pass` and `xoauth2`
properties.

_Example:_

```js
await connection.login({
  user: 'from@example.com',
  pass: 'secret'
})
```

### send

```js
const info = await connection.send(envelope, message)
```

Send a message with an envelope. The `info` object is returned in a Promise.

_Example:_

```js
const envelope = {
  from: 'from@example.com',
  to: 'to@example.net'
}

const message = '' +
  'From: from@example.com\n' +
  'To: to@example.net\n' +
  'Subject: test\n' +
  '\n' +
  'Test\n'

const info = await connection.send(envelope, message)
console.log(info.response)
```

### quit

```js
const hadError = await connection.quit()
```

Graceful SMTP session ending. The `QUIT` command is sent. `hadError` is `true`
if the socket was closed due to a transmission error and `null` when was
already closed.

### close

```js
const hadError = await connection.close()
```

Disconnecting of SMTP session.

### reset

```js
await connection.reset()
```

Reseting the SMTP session. The `RSET` command is set.

## License

Copyright (c) 2016-2018 Piotr Roszatycki <piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)
