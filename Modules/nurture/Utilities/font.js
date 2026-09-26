import {css} from "lit";

const fontSheet = new CSSStyleSheet();

fontSheet.replaceSync(css`
  @font-face {
    font-family: "Quicksand";
    src: url("${new URL("./CSS/Quicksand.ttf", import.meta.url)}");
  }

  @font-face {
    font-family: "Fira Mono";
    src: url("${new URL("./CSS/FiraMono.ttf", import.meta.url)}");
  }
`);

document.adoptedStyleSheets = [...document.adoptedStyleSheets, fontSheet];
