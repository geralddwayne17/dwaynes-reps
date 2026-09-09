import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../Background";
import { colors } from "../colors";

export const LogoIntro: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200, mass: 0.6 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const glow = 0.55 + 0.45 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: glow,
          }}
        >
          <div
            style={{
              width: 620,
              height: 620,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(242,185,13,0.35) 0%, rgba(242,185,13,0) 65%)",
            }}
          />
        </AbsoluteFill>
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 460,
            transform: `scale(${scale})`,
            opacity,
          }}
        />
        <div
          style={{
            marginTop: 18,
            opacity: interpolate(frame, [20, 35], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            color: colors.chalkDim,
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Entrenamiento con IA
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
