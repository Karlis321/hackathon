import { Composition } from "remotion";
import { HowItWorks } from "./HowItWorks";
import { PITCH_FPS, PITCH_FRAMES, PitchVideo } from "./PitchVideo";
import { DroneImpact, IMPACT_FPS, IMPACT_FRAMES } from "./DroneImpact";
import { CAGE_FPS, CAGE_FRAMES, CageImpact } from "./CageImpact";

export const Root = () => (
  <>
    <Composition id="HowItWorks" component={HowItWorks} durationInFrames={1000} fps={30} width={1920} height={1080} />
    <Composition id="PitchVideo" component={PitchVideo} durationInFrames={PITCH_FRAMES} fps={PITCH_FPS} width={1920} height={1080} />
    <Composition id="DroneImpact" component={DroneImpact} durationInFrames={IMPACT_FRAMES} fps={IMPACT_FPS} width={1920} height={1080} />
    <Composition id="CageImpact" component={CageImpact} durationInFrames={CAGE_FRAMES} fps={CAGE_FPS} width={1920} height={1080} />
  </>
);
