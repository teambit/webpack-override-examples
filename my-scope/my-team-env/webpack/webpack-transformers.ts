import {
  WebpackConfigTransformer,
  WebpackConfigMutator,
  WebpackConfigTransformContext,
} from "@teambit/webpack";
import { StylableWebpackPlugin } from "@stylable/webpack-plugin";


/**
 * Transformation to apply for both preview and dev server
 * @param config 
 * @param context 
 */
function commonTransformation(
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) {
  // add stylable support
  config.addPlugin(new StylableWebpackPlugin({ }));
  return config;
}

/**
 * Transformation for the preview only
 * @param config 
 * @param context 
 * @returns 
 */
export const previewConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  // @ts-ignore
  const oneOfRules = newConfig.raw.module.rules.find(rule => !!rule.oneOf);
  // @ts-ignore
  const cssRule = findCssRule(oneOfRules.oneOf, `/(?<!\\.module)\\.css$/`);
  excludeStCssFromRule(cssRule);
  return newConfig;
}

/**
 * Transformation for the dev server only
 * @param config 
 * @param context 
 * @returns 
 */
export const devServerConfigTransformer: WebpackConfigTransformer = (
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) => {
  const newConfig = commonTransformation(config, context);
  const cssRule = findCssRule(newConfig.raw.module.rules);
  excludeStCssFromRule(cssRule, /\.(module|st)\.css$/);
  return newConfig;
};

function findCssRule(rules: Array<any>, testMatcher = `/\\.css$/`) {
  return rules.find((rule) => rule.test && rule.test.toString() === testMatcher);
}

function excludeStCssFromRule(rule, excluder = /\.st\.css$/) {
  rule.exclude = excluder;
  return rule;
}