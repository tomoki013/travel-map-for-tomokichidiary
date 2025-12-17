import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // 1. 旧ドメイン (map.tomokichidiary.com) からのアクセスを検知
  if (hostname === "map.tomokichidiary.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.hostname = "travel.tomokichidiary.com";
    url.port = "";

    // basePathが設定されているため、pathnameには既に '/map' が含まれているはずですが、
    // 万が一ルート('/')へのアクセスの場合は '/map' を明示的にセット
    if (pathname === "/") {
      url.pathname = "/map";
    }

    // 強制リダイレクト
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
