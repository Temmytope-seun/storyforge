import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Pre-launch access gate for the actual app (dashboard, editor, and the API
 * routes that drive paid AI generation). The public site (`/`, `/api/waitlist`)
 * is intentionally not matched here and stays fully open.
 *
 * Only activates when both env vars are set — unset locally by default, so
 * dev stays frictionless; set them in production to turn the gate on.
 */
export function proxy(request: NextRequest) {
  const user = process.env.APP_ACCESS_USER;
  const pass = process.env.APP_ACCESS_PASSWORD;
  if (!user || !pass) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    const suppliedUser = decoded.slice(0, separatorIndex);
    const suppliedPass = decoded.slice(separatorIndex + 1);
    if (suppliedUser === user && suppliedPass === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="StoryForge"' },
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/api/projects/:path*",
    "/api/scenes/:path*",
    "/api/shots/:path*",
    "/api/characters/:path*",
  ],
};
