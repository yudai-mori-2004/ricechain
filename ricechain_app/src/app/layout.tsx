export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {/* <Header /> */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
