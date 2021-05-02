import { MainRuntime } from '@teambit/cli';
import ReactAspect, { ReactMain, UseWebpackModifiers } from "@teambit/react";
import EnvsAspect, {Environment, EnvsMain, EnvTransformer} from '@teambit/envs';
import { MyOrgEnvAspect } from './my-org-env.aspect';
import {previewConfigTransformer, devServerConfigTransformer} from './webpack/webpack-transformers'

type MyOrgEnvDeps = [
  EnvsMain,
  ReactMain
]
  
export class MyOrgEnvMain {
  constructor(
    readonly react: ReactMain,
    readonly envs: EnvsMain,
    readonly orgEnv: Environment
  ) {}
  static slots = [];
  static dependencies = [EnvsAspect, ReactAspect];
  static runtime = MainRuntime;

  useWebpack(modifiers?: UseWebpackModifiers) {
    const mergedModifiers: UseWebpackModifiers = {
      previewConfig: (modifiers.previewConfig ?? []).concat(
        previewConfigTransformer
      ),
      devServerConfig: (modifiers.devServerConfig ?? []).concat(
        devServerConfigTransformer
      ),
    };
    return this.react.useWebpack(mergedModifiers);
  }

  /**
   * create a new composition of the node environment.
   */
  compose(transformers: EnvTransformer[], targetEnv: Environment = {}) {
    return this.envs.compose(
      this.envs.merge(targetEnv, this.orgEnv),
      transformers
    );
  }

  static async provider([envs, react]: MyOrgEnvDeps) {
    const webpackModifiers: UseWebpackModifiers = {
      previewConfig: [previewConfigTransformer],
      devServerConfig: [devServerConfigTransformer],
    };
    const myEnv = react.compose([react.useWebpack(webpackModifiers)]);
    envs.registerEnv(myEnv);
    return new MyOrgEnvMain(react, envs, myEnv);
  }
}

MyOrgEnvAspect.addRuntime(MyOrgEnvMain);
