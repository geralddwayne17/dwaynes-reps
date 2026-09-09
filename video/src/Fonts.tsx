import React from "react";
import { staticFile } from "remotion";

export const Fonts: React.FC = () => {
  return (
    <style>{`
      @font-face {
        font-family: "Inter";
        font-style: normal;
        font-weight: 100 900;
        font-display: block;
        src: url("${staticFile("fonts/Inter-normal.woff2")}") format("woff2");
      }
      @font-face {
        font-family: "Inter";
        font-style: italic;
        font-weight: 100 900;
        font-display: block;
        src: url("${staticFile("fonts/Inter-italic.woff2")}") format("woff2");
      }
    `}</style>
  );
};
