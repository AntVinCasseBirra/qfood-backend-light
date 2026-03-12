import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import 'animate.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
          <title>QFood.it</title>
        {/* <link rel="icon" href="/logo.png"/> */}
      </head>
      <body>
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
