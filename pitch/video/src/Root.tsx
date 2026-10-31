import { Composition } from "remotion";
import { HowItWorks } from "./HowItWorks";

export const Root = () => (
  <Composition id="HowItWorks" component={HowItWorks} durationInFrames={900} fps={30} width={1920} height={1080} />
);
