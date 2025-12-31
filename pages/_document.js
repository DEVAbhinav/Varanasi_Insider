import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Detect language from the URL path
    const pathname = ctx.asPath || ctx.req?.url || '';
    const pathLang = pathname.split('/')[1];
    const lang = pathLang === 'hi' ? 'hi' : 'en';

    return { ...initialProps, lang };
  }

  render() {
    return (
      <Html lang={this.props.lang}>
        <Head>
          {/* DNS Prefetch for third-party origins */}
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />

          {/* Preconnect for critical third-party origins */}
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
