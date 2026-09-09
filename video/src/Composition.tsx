import { Composition } from "remotion";
import { BrandPromo, TOTAL_DURATION } from "./BrandPromo";

export const MyComposition = () => {
  return (
    <Composition
      id="BrandPromo"
      component={BrandPromo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
