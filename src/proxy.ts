import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // アクセスされたドメイン（ホスト名）を取得
  const hostname = request.headers.get("host") || "";

  // ■ ケース1: 旧ドメイン (map.tomokichidiary.com) からのアクセスの場合
  // → 新しい親ドメインの配下へ 301リダイレクト
  if (hostname === "map.tomokichidiary.com") {
    const url = request.nextUrl.clone();

    // 転送先の設定
    url.protocol = "https";
    url.hostname = "travel.tomokichidiary.com";
    url.port = ""; // ポート指定があれば消す

    // パスは basePath ('/map') が既に付いている前提で調整
    // ※ next.config.ts で basePath: '/map' を設定済みの場合、
    // request.nextUrl.pathname には既に /map が含まれています。
    // そのため、単純にドメインだけ変えればOKな場合が多いですが、
    // 念のためパスを確認して構成します。

    return NextResponse.redirect(url, 301);
  }

  // ■ ケース2: 親サイトのプロキシ (travel.tomokichidiary.com)
  //   または Netlifyのドメイン (travel-map...netlify.app) からのアクセス
  // → そのまま表示（リダイレクトしない）
  return NextResponse.next();
}

// ミドルウェアを適用するパス（静的ファイルなどは除外）
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
