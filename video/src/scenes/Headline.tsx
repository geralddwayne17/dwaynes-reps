import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../Background";
import { colors } from "../colors";

const Line: React.FC<{
  children: React.ReactNode;
  delay: number;
  color: string;
  italic?: boolean;
}> = ({ children, delay, color, italic }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 18], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        color,
        fontFamily: "Inter",
        fontWeight: 800,
        fontStyle: italic ? "italic" : "normal",
        fontSize: 76,
        lineHeight: 1.08,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

export const Headline: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 90px",
        }}
      >
        <Line delay={0} color={colors.chalk}>
          ENTRENA MÁS
        </Line>
        <Line delay={8} color={colors.chalk}>
          INTELIGENTE,
        </Line>
        <Line delay={22} color={colors.volt} italic>
          NO MÁS DURO
        </Line>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
