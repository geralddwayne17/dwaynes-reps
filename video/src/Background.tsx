import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "./colors";

export const Background: React.FC<{ glow?: boolean }> = ({ glow = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {glow ? (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 38%, rgba(242,185,13,0.16) 0%, rgba(242,185,13,0) 70%)",
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 140% 90% at 50% 100%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
    </AbsoluteFill>
  );
};
