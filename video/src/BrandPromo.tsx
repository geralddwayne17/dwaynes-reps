import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fonts } from "./Fonts";
import { LogoIntro } from "./scenes/LogoIntro";
import { Headline } from "./scenes/Headline";
import { Tagline } from "./scenes/Tagline";
import { AppDemo } from "./scenes/AppDemo";
import { CTA } from "./scenes/CTA";

export const SCENES = {
  logo: { from: 0, duration: 100 },
  headline: { from: 85, duration: 175 },
  tagline: { from: 245, duration: 135 },
  demo: { from: 365, duration: 155 },
  cta: { from: 505, duration: 95 },
};

export const TOTAL_DURATION = 600;

export const BrandPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Fonts />
      <Sequence from={SCENES.logo.from} durationInFrames={SCENES.logo.duration}>
        <LogoIntro durationInFrames={SCENES.logo.duration} />
      </Sequence>
      <Sequence from={SCENES.headline.from} durationInFrames={SCENES.headline.duration}>
        <Headline durationInFrames={SCENES.headline.duration} />
      </Sequence>
      <Sequence from={SCENES.tagline.from} durationInFrames={SCENES.tagline.duration}>
        <Tagline durationInFrames={SCENES.tagline.duration} />
      </Sequence>
      <Sequence from={SCENES.demo.from} durationInFrames={SCENES.demo.duration}>
        <AppDemo durationInFrames={SCENES.demo.duration} />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
