# Changelog

## v3.3.0 2018-05-11

* Wait for `close` event but only when connection and socket are not destroyed.

## v3.2.0 2018-05-10

* Wait for `end` event instead of `close`.
* Methods `quit` and `close` resolve to `undefined` value.

## v3.1.1 2018-05-10

* Bugfix for tests.

## v3.1.0 2018-05-10

* Guard `reset` method.

## v3.0.3 2018-04-11

* Check README with linter.

## v3.0.2 2018-04-07

* Reject if SMTP session is already ended.

## v3.0.1 2018-03-09

* Typescript: use @types/nodemailer@4.6.0.

## v3.0.0 2018-02-09

* Removed `PromiseReadable` support for `send` method.

## v2.0.5 2017-10-26

* Typescript: use typings from DefinitelyTyped.

## v2.0.4 2017-10-21

* Typescript: Re-export types from nodemailer which are used directly in
  this API.

## v2.0.3 2017-10-20

* Typescript: typings for nodemailer from DefinitelyTyped; data stream is
  `Readable`; symbols from nodemailer are not re-exported.

## v2.0.2 2017-10-09

* Do not export external typings.

## v2.0.1 2017-10-09

* Typescript: depends on `smtp-server-as-promised` and use its typings for
  `nodemailer-shared` temporarily until `@types/nodemailer` and
  `@types/smtp-server` will be ready.

## v2.0.0 2017-10-06

* Use native `Promise` rather than `any-event`.
* `message` for `send` method can be `PromiseReadable`.

## v1.1.1 2017-10-06

* Typescript: reference additional modules in our typings file.

## v1.1.0 2017-10-06

* nodemailer@4.1.3
* Typescript: reexport symbols from `mail-composer`, `mime-node`,
  `nodemailer-shared` and `smtp-connection`.
* Typescript: streams are `NodeJS.ReadableStream`.

## v1.0.0 2017-10-03

* Exports also as a class and namespace and the default.
* Typings for Typescript.
* Based on promise-readable@1.x.x

## v0.1.1 2017-06-08

* Upgraded chai@4.0.2, chai-as-promised@7.0.0, promise-socket@0.0.2,
  smtp-server-as-promised@0.1.2, tap@10.5.1, tap-given@0.4.1

## v0.1.0 2017-04-11

* Uses `smtp-connection` from `nodemailer` on MIT license.

## v0.0.1 2017-03-23

* Initial release
