const fontSheet = new CSSStyleSheet();

fontSheet.replaceSync(`
  @font-face {
    font-family: "Fira Mono";
    src: url("${new URL("../Fonts/FiraMono.ttf", import.meta.url)}");
  }
`);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontSheet];
