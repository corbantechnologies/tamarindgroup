export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/kitchen/:path*",
    "/(private)/:path*",
    "/centers/:path*",
    "/reports/:path*",
  ],
};
