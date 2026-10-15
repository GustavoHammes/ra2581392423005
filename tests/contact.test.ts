import { afterEach, mock, test } from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import contact from "../api/contact";
import { CONTACT_EMAIL } from "../src/data/profile";

const originalEnvironment = {
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
};

afterEach(() => {
  mock.restoreAll();
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function response() {
  const result = { code: 200, body: undefined as unknown };
  const res = {
    status(code: number) {
      result.code = code;
      return res;
    },
    json(body: unknown) {
      result.body = body;
      return res;
    },
  } as unknown as VercelResponse;
  return { res, result };
}

const request = (patch: Record<string, unknown> = {}) =>
  ({
    method: "POST",
    body: {
      name: "Visitante de teste",
      email: "visitor@example.com",
      message: "Mensagem de teste do formulário de contato.",
      ...patch,
    },
  }) as VercelRequest;

test("contact sends to the new public address using a different SMTP sender", async () => {
  process.env.GMAIL_USER = "legacy-sender@example.com";
  process.env.GMAIL_APP_PASS = "fake-test-only-password";
  const messages: Record<string, unknown>[] = [];
  const transport = mock.method(
    nodemailer,
    "createTransport",
    () =>
      ({
        async sendMail(message: Record<string, unknown>) {
          messages.push(message);
          return { accepted: [message.to], rejected: [], response: "250 queued" };
        },
      }) as ReturnType<typeof nodemailer.createTransport>,
  );
  const { res, result } = response();
  await contact(request(), res);
  assert.equal(result.code, 200);
  assert.equal(transport.mock.callCount(), 1);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].to, "gustavohfhammes@gmail.com");
  assert.equal(messages[0].to, CONTACT_EMAIL);
  assert.match(String(messages[0].from), /legacy-sender@example.com/);
  assert.equal(messages[0].replyTo, "visitor@example.com");
  assert.equal(messages[1].to, "visitor@example.com");
});

test("missing SMTP credentials show the new fallback address without sending mail", async () => {
  delete process.env.GMAIL_USER;
  delete process.env.GMAIL_APP_PASS;
  const transport = mock.method(nodemailer, "createTransport");
  const { res, result } = response();
  await contact(request(), res);
  assert.equal(result.code, 503);
  assert.match(JSON.stringify(result.body), /gustavohfhammes@gmail.com/);
  assert.equal(transport.mock.callCount(), 0);
});

test("visitor content is escaped in HTML messages", async () => {
  process.env.GMAIL_USER = "legacy-sender@example.com";
  process.env.GMAIL_APP_PASS = "fake-test-only-password";
  const messages: Record<string, unknown>[] = [];
  mock.method(
    nodemailer,
    "createTransport",
    () =>
      ({
        async sendMail(message: Record<string, unknown>) {
          messages.push(message);
          return { accepted: [message.to], rejected: [] };
        },
      }) as ReturnType<typeof nodemailer.createTransport>,
  );
  const { res, result } = response();
  await contact(
    request({ name: "Gustavo <teste>", message: "Mensagem com <script>alert('teste')</script>" }),
    res,
  );
  assert.equal(result.code, 200);
  assert.ok(String(messages[0].html).includes("&lt;script&gt;"));
  assert.ok(!String(messages[0].html).includes("<script>"));
  assert.ok(String(messages[1].html).includes("Gustavo"));
});
