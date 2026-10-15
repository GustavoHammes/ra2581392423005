import { afterEach, test, mock } from "node:test";
import assert from "node:assert/strict";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { externalUrl, repositoryKey, selectPortfolioRepos } from "../src/lib/github";
import type { GitHubRepo } from "../src/data/github";
import { loadGitHubRepos } from "../server/github";
import github from "../api/github";
import auth from "../api/auth";
import contact from "../api/contact";
import upload from "../api/uploadFile";

const repo = (patch: Partial<GitHubRepo> = {}): GitHubRepo => ({
  id: 1,
  name: "new-project",
  full_name: "GustavoHammes/new-project",
  description: "Project",
  html_url: "https://github.com/GustavoHammes/new-project",
  homepage: null,
  language: "TypeScript",
  topics: ["portfolio"],
  stargazers_count: 0,
  pushed_at: "2026-10-01T12:00:00Z",
  updated_at: "2026-10-01T12:00:00Z",
  fork: false,
  archived: false,
  disabled: false,
  private: false,
  ...patch,
});
const originalPassword = process.env.ADMIN_PASSWORD;
afterEach(() => {
  mock.restoreAll();
  if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = originalPassword;
});

function response() {
  const result = { code: 200, body: undefined as unknown, headers: {} as Record<string, string> };
  const res = {
    setHeader(name: string, value: string) {
      result.headers[name] = value;
      return res;
    },
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

test("new repositories opt in via portfolio topic; exercises stay out", () => {
  const selected = selectPortfolioRepos([repo(), repo({ id: 2, name: "exercise", topics: [] })]);
  assert.deepEqual(
    selected.map((item) => item.name),
    ["new-project"],
  );
});
test("existing curated projects remain visible before topics are set", () => {
  assert.equal(selectPortfolioRepos([repo({ name: "entregalab", topics: [] })]).length, 1);
});
test("private, archived, forked and disabled repositories stay out", () => {
  for (const field of ["private", "archived", "fork", "disabled"])
    assert.equal(selectPortfolioRepos([repo({ [field]: true })]).length, 0);
});
test("featured repositories are not repeated, including nested monorepo links", () => {
  const key = repositoryKey(
    "https://github.com/GustavoHammes/Projetos_caseiros/tree/main/Projeto%20mp3_mp4",
  );
  assert.equal(key, "gustavohammes/projetos_caseiros");
  assert.equal(
    selectPortfolioRepos([repo({ full_name: "GustavoHammes/Projetos_caseiros" })], [key!]).length,
    0,
  );
});
test("selected projects are ordered by last code push", () => {
  const items = selectPortfolioRepos([
    repo({ id: 1 }),
    repo({ id: 2, pushed_at: "2026-10-10T12:00:00Z" }),
  ]);
  assert.deepEqual(
    items.map((item) => item.id),
    [2, 1],
  );
});
test("only HTTP(S) external links without credentials are accepted", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.test",
    "https://user:password@example.com",
    "invalid",
  ])
    assert.equal(externalUrl(value), undefined);
  assert.equal(externalUrl("https://example.com"), "https://example.com/");
  assert.equal(repositoryKey("https://github.com.evil.test/owner/repo"), undefined);
});
test("GitHub pagination reads next pages and only emits public fields", async () => {
  let calls = 0;
  mock.method(globalThis, "fetch", async (input: string, init: RequestInit) => {
    calls += 1;
    assert.equal((init.headers as Record<string, string>).Authorization, "Bearer read-only-test");
    assert.ok(input.includes(`page=${calls}`));
    return new Response(
      JSON.stringify(
        calls === 1
          ? [{ ...repo(), secret: "must-not-leak" }, repo({ private: true })]
          : [repo({ id: 2 })],
      ),
      {
        headers: calls === 1 ? { link: '<https://api.github.com/example?page=2>; rel="next"' } : {},
      },
    );
  });
  const items = await loadGitHubRepos("personal", "read-only-test");
  assert.equal(calls, 2);
  assert.equal(items.length, 2);
  assert.ok(!("secret" in items[0]));
  assert.ok(items.every((item) => !item.private));
});
test("upstream failures are rejected", async () => {
  mock.method(globalThis, "fetch", async () => new Response("{}", { status: 403 }));
  await assert.rejects(loadGitHubRepos("personal"), /403/);
});
test("GitHub endpoint validates account and HTTP method", async () => {
  for (const [request, expected] of [
    [{ method: "POST", query: {} }, 405],
    [{ method: "GET", query: { account: "someone-else" } }, 400],
    [{ method: "GET", query: { account: ["team", "personal"] } }, 400],
  ] as const) {
    const { res, result } = response();
    await github(request as unknown as VercelRequest, res);
    assert.equal(result.code, expected);
  }
});
test("successful public responses are cached at the CDN", async () => {
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify([repo()])));
  const { res, result } = response();
  await github({ method: "GET", query: {} } as VercelRequest, res);
  assert.equal(result.code, 200);
  assert.match(result.headers["Cache-Control"], /s-maxage=600/);
});
test("GitHub failures are not cached", async () => {
  mock.method(globalThis, "fetch", async () => new Response("{}", { status: 429 }));
  const { res, result } = response();
  await github({ method: "GET", query: { account: "personal" } } as unknown as VercelRequest, res);
  assert.equal(result.code, 503);
  assert.equal(result.headers["Cache-Control"], "no-store");
});
test("admin authentication fails closed without a configured password", () => {
  delete process.env.ADMIN_PASSWORD;
  const { res, result } = response();
  auth({ method: "POST", body: {} } as VercelRequest, res);
  assert.equal(result.code, 401);
});
test("admin authentication accepts only the configured password", () => {
  process.env.ADMIN_PASSWORD = "test-password";
  for (const [password, expected] of [
    ["incorrect", 401],
    ["test-password", 200],
    [null, 401],
  ] as const) {
    const { res, result } = response();
    auth({ method: "POST", body: { password } } as VercelRequest, res);
    assert.equal(result.code, expected);
    assert.equal(result.headers["Cache-Control"], "no-store");
  }
});
test("uploads reject unauthenticated requests even when the server password is missing", async () => {
  delete process.env.ADMIN_PASSWORD;
  const { res, result } = response();
  await upload({ method: "POST", body: {} } as VercelRequest, res);
  assert.equal(result.code, 401);
});
test("contact rejects invalid types and header injection without sending mail", async () => {
  for (const body of [
    { name: {}, email: "x@example.com", message: "Hello world" },
    { name: "Test\r\nInjected", email: "x@example.com", message: "Hello world" },
  ]) {
    const { res, result } = response();
    await contact({ method: "POST", body } as VercelRequest, res);
    assert.equal(result.code, 400);
  }
});
test("contact honeypot does not send messages", async () => {
  const { res, result } = response();
  await contact({ method: "POST", body: { website: "spam.test" } } as VercelRequest, res);
  assert.equal(result.code, 200);
});
