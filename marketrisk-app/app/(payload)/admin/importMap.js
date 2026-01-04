export const importMap = {
  "@payloadcms/next/views/Root#RootLayout": () =>
    import("@payloadcms/next/views").then((m) => m.RootLayout),
  "@payloadcms/next/views/Root#RootPage": () =>
    import("@payloadcms/next/views").then((m) => m.RootPage),
}
