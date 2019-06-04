import {expect} from "chai"

import {After, And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import {
  SMTPServerAsPromised,
  SMTPServerAsPromisedServerAddress,
  SMTPServerAuthentication,
  SMTPServerAuthenticationResponse,
  SMTPServerSession,
} from "smtp-server-as-promised"

import {SMTPConnectionAsPromised, SMTPConnectionSentMessageInfo} from "../src/smtp-connection-as-promised"

Feature("Test smtp-connection-as-promised module", () => {
  const crlf = "\x0d\x0a"

  const from = "sender@example.com"
  const to = "recipient@example.net"
  const user = "user"
  const pass = "pass"

  // prettier-ignore
  const rfc2822Message =
    '' +
    'From: ' + from + crlf +
    'To: ' + to + crlf +
    'Subject: test' + crlf +
    crlf +
    'Test' + crlf +
    '.' + crlf

  class MySMTPServerAsPromised extends SMTPServerAsPromised {
    async onAuth(
      auth: SMTPServerAuthentication,
      _session: SMTPServerSession,
    ): Promise<SMTPServerAuthenticationResponse> {
      if (auth.method === "PLAIN" && auth.username === user && auth.password === pass) {
        return {user: auth.username}
      } else {
        throw new Error("Invalid username or password")
      }
    }
  }

  Scenario("Send one mail", () => {
    let address: SMTPServerAsPromisedServerAddress
    let client: SMTPConnectionAsPromised
    let info: SMTPConnectionSentMessageInfo
    let server: SMTPServerAsPromised

    Given("SMTPServerAsPromised object", () => {
      server = new MySMTPServerAsPromised({
        hideSTARTTLS: true,
      })
    })

    When("listen method is used", async () => {
      address = await server.listen({port: 0})
    })

    Then("port number should be correct", () => {
      expect(address.port)
        .to.be.above(1024)
        .and.below(65535)
    })

    When("I create new SMTPConnectionAsPromised object", () => {
      client = new SMTPConnectionAsPromised({
        ignoreTLS: true,
        port: address.port,
        logger: false,
      })
    })

    And("I connect to the server", async () => {
      await client.connect()
    })

    And("I login to the server", async () => {
      await client.login({user, pass})
    })

    And("I send the message envelope and body", async () => {
      info = await client.send({from, to}, rfc2822Message)
    })

    Then("response is correct", () => {
      expect(info)
        .to.have.property("accepted")
        .that.deep.equals(["recipient@example.net"])
      expect(info)
        .to.have.property("rejected")
        .that.deep.equals([])
      expect(info)
        .to.have.property("response")
        .that.equals("250 OK: message queued")
    })

    When("I reset the SMTP session", async () => {
      await client.reset()
    })

    And("I quit the SMTP session", async () => {
      await client.quit()
    })

    And("I close the SMTP session", async () => {
      await client.close()
    })

    Then("SMTP session is ended", async () => {
      // nothing
    })

    After(async () => {
      await client.destroy()
    })

    After(async () => {
      await server.destroy()
    })
  })
})
