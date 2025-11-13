import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="ModularSpace - Design your perfect modular furniture with our 3D configurator" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
