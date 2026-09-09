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

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const buttonScale = spring({
    frame: frame - 26,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.5 },
  });
  const pulse = 1 + 0.03 * Math.sin(frame / 6);

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 220,
            transform: `scale(${logoScale})`,
            marginBottom: 28,
          }}
        />
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: "Inter",
            fontWeight: 800,
            fontSize: 62,
            color: colors.chalk,
            marginBottom: 44,
          }}
        >
          Empezá gratis hoy
        </div>
        <div
          style={{
            transform: `scale(${buttonScale * pulse})`,
            background: `linear-gradient(135deg, ${colors.voltBright}, ${colors.voltDim})`,
            borderRadius: 999,
            padding: "26px 76px",
          }}
        >
          <div
            style={{
              fontFamily: "Inter",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: 1,
              color: colors.ink,
            }}
          >
            COMENZAR
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
