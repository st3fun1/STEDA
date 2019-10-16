import Document, { Head, Main, NextScript } from "next/document";

export default class extends Document {
  render() {
    /**
     * Here we use _document.js to add a "lang" propery to the HTML object if
     * one is set on the page.
     **/
    return (
      <html lang={"en"}>
        <Head>
          <title>STEDA</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
