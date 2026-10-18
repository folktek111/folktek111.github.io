// Password lock for /kitten. Password is the KITTEN_PASSWORD
// environment variable set in Cloudflare Pages settings (never in this repo).
// Any username works; only the password is checked.
// If KITTEN_PASSWORD is not set, nobody gets in.

const LOCKED = "/kitten";

async function same(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.byteLength !== y.byteLength) {
    await crypto.subtle.timingSafeEqual(x, x);
    return false;
  }
  return crypto.subtle.timingSafeEqual(x, y);
}

function deny() {
  return new Response("Locked.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="=^.^=", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;
  if (path !== LOCKED && !path.startsWith(LOCKED + "/")) {
    return context.next();
  }

  const secret = context.env.KITTEN_PASSWORD;
  if (!secret) return deny();

  const auth = context.request.headers.get("Authorization") || "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) return deny();

  let decoded;
  try {
    decoded = atob(encoded);
  } catch {
    return deny();
  }
  const pass = decoded.slice(decoded.indexOf(":") + 1);
  if (!(await same(pass, secret))) return deny();

  const res = await context.next();
  const out = new Response(res.body, res);
  out.headers.set("Cache-Control", "no-store");
  return out;
}
