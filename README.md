## smtp-connection-as-promised

This module provides promisified version of `smtp-connection` class. The API is
the same except that all methods returns `Promise` object.

### Installation

```shell
npm install smtp-connection-as-promised
```

### Usage

```js
const SmtpConnectionAsPromised = require('smtp-connection-as-promised')

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

const message = '' +
  'From: from@example.com\n' +
  'To: to@example.net\n' +
  'Subject: test\n' +
  '\n' +
  'Test\n'

const connection = new SmtpConnectionAsPromised(options)

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
```

### Promise

This module uses `any-promise` and any ES6 Promise library or polyfill is
supported.

Ie. `bluebird` can be used as Promise library for this module, if it is
registered before.

```js
require('any-promise/register/bluebird')
const smtpConnectionAsPromised = require('smtp-connection-as-promised')
```

### License

Copyright (c) 2016 Piotr Roszatycki <piotr.roszatycki@gmail.com>

[Artistic License 2.0](https://opensource.org/licenses/Artistic-2.0)
