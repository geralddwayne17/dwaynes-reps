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

export const AppDemo: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const exit = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(enter, [0, 1], [60, 0]);

  const badgeOpacity = interpolate(frame, [26, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background glow={false} />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            opacity: enter,
            transform: `translateY(${y}px)`,
            width: 460,
            height: 940,
            borderRadius: 56,
            padding: 14,
            background:
              "linear-gradient(160deg, #2c2c30 0%, #0d0d0f 60%)",
            boxShadow:
              "0 40px 90px rgba(0,0,0,0.55), 0 0 0 2px rgba(242,185,13,0.25)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 42,
              overflow: "hidden",
              backgroundColor: colors.ink,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoom})`,
                transformOrigin: "center top",
              }}
            >
              <Img
                src={staticFile("app-screenshot.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 130,
                height: 26,
                borderRadius: 14,
                backgroundColor: "#000",
              }}
            />
          </div>
        </div>

        <div
          style={{
            opacity: badgeOpacity,
            marginTop: 40,
            padding: "16px 32px",
            borderRadius: 999,
            backgroundColor: colors.concreteLight,
            border: `2px solid ${colors.volt}`,
            color: colors.voltBright,
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 30,
          }}
        >
          Empezá en menos de un minuto
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
