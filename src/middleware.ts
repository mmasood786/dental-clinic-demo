import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic auth for `/admin`.
 *
 * The password lives in `ADMIN_PASSWORD` (never in the bundle, never in the
 * repository). Without it the pages answer 503 instead of opening up, so a
 * half-configured deployment cannot leak clinic analytics.
 */
export const config = {
  matcher: ["/admin/:path*"],
};

const REALM = 'Basic realm="Clinic analytics", charset="UTF-8"';

/** Length-constant comparison, so response timing does not leak the password. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return difference === 0;
}

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new NextResponse(
      "Admin analytics is not configured. Set ADMIN_PASSWORD in the environment.",
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const header = request.headers.get("authorization");

  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice("Basic ".length));
      const separator = decoded.indexOf(":");
      const supplied = separator === -1 ? "" : decoded.slice(separator + 1);

      if (safeEqual(supplied, password)) {
        return NextResponse.next();
      }
    } catch {
      // Malformed header: fall through to the 401 below.
    }
  }

  return unauthorized();
}
