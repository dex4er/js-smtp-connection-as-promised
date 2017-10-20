# Changelog

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
