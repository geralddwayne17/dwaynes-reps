import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "../Background";
import { colors } from "../colors";

const features = [
  { label: "Tu nivel", color: colors.volt },
  { label: "Tus días", color: colors.mint },
  { label: "Tu equipo", color: colors.chalk },
];

const Feature: React.FC<{ label: string; color: string; delay: number }> = ({
  label,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(local, [0, 16], [-24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          backgroundColor: color,
        }}
      />
      <div
        style={{
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 38,
          color: colors.chalk,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Tagline: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const taglineOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 100px",
        }}
      >
        <div
          style={{
            opacity: taglineOpacity,
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: 40,
            lineHeight: 1.4,
            textAlign: "center",
            color: colors.chalkDim,
            marginBottom: 64,
          }}
        >
          Tu rutina personalizada con IA, adaptada a
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            alignItems: "flex-start",
          }}
        >
          {features.map((f, i) => (
            <Feature key={f.label} label={f.label} color={f.color} delay={20 + i * 10} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
