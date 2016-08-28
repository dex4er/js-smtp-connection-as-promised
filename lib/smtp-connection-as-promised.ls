#!/usr/bin/env lsc

require! {
  'any-promise': Promise
  'promise-once-events'
  'smtp-connection'
}

module.exports = class smtp-connection-as-promised extends promise-once-events
  (@options = {}) ->
    @connection = new smtp-connection @options

  connect: ->
    new Promise (resolve, reject) ~>
      rejector = (err) ~>
        reject err
      @connection.once 'error', rejector
      @connection.connect ~>
        @connection.removeListener 'error', rejector
        @secure = @connection.secure
        resolve!

  login: (auth) ->
    new Promise (resolve, reject) ~>
      @connection.login auth, (err) ~>
        if err
          reject err
        else
          resolve!

  send: (envelope, message) ->
    new Promise (resolve, reject) ~>
      @connection.send envelope, message, (err, info) ~>
        if err
          reject err
        else
          resolve info

  quit: ->
    new Promise (resolve) ~>
      socket = @connection._socket
      if @connection
        @connection.close!
      if socket and not socket.destroyed
        socket.once 'close', resolve
      else
        resolve!

  close: ->
    new Promise (resolve) ~>
      socket = @connection._socket
      if @connection
        @connection.close!
      if socket and not socket.destroyed
        socket.once 'close', resolve
      else
        resolve!

  reset: ->
    new Promise (resolve, reject) ~>
      @connection.reset (err) ~>
        if err
          reject err
        else
          resolve!
