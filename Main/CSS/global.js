import {css} from "lit";

export const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  .defaulttitle {
    margin-top: 3rem;
    font-size: 3em;
  }

  .selectable {
    -webkit-user-select: text;
  }

  .wrapper {
    text-align: center;
  }

  :focus {
    outline: unset;
  }
`;
