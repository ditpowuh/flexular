import {css, unsafeCSS} from "lit";

const fontSheet = new CSSStyleSheet();

fontSheet.replaceSync(css`
  @font-face {
    font-family: "Fira Mono";
    src: url("${unsafeCSS(new URL("../Fonts/FiraMono.ttf", import.meta.url))}");
  }
`);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontSheet];
