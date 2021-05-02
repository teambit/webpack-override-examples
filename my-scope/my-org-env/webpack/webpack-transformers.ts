import {
  WebpackConfigTransformer,
  WebpackConfigMutator,
  WebpackConfigTransformContext,
} from "@teambit/webpack";
import webpackConfig from './webpack-config';


/**
 * Transformation to apply for both preview and dev server
 * @param config 
 * @param context 
 */
function commonTransformation(
  config: WebpackConfigMutator,
  context: WebpackConfigTransformContext
) {
  // Merge config with the webpack-config.js file - adding handlebars support
  config.merge([webpackConfig]).addAliases({
    "react-dom/test-utils": require.resolve("@hot-loader/react-dom/test-utils"),
  });
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
  return newConfig;
};