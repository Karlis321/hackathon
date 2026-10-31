import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

// Tailwind classes in compositions (used by the 30 s pitch video)
Config.overrideWebpackConfig((config) => enableTailwind(config));
