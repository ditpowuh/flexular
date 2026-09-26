import {css} from "lit";

const fontSheet = new CSSStyleSheet();

fontSheet.replaceSync(css`
  @font-face {
    font-family: "Fira Mono";
    src: url("${new URL("../Fonts/FiraMono.ttf", import.meta.url)}");
  }
`);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontSheet];
