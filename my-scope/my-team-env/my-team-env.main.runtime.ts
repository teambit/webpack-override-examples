import { MainRuntime } from '@teambit/cli';
import ReactAspect, { ReactMain, UseWebpackModifiers } from "@teambit/react";
import MyOrgEnvAspect, { MyOrgEnvMain } from "@my-scope/my-org-env";
import EnvsAspect, { Environment, EnvsMain } from "@teambit/envs";
import { MyTeamEnvAspect } from "./my-team-env.aspect";
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from "./webpack/webpack-transformers";

type MyOrgEnvDeps = [EnvsMain, MyOrgEnvMain];

export class MyTeamEnvMain {
  constructor(readonly teamEnv: Environment) {}
  static slots = [];
  static dependencies = [EnvsAspect, MyOrgEnvAspect];
  static runtime = MainRuntime;
  static async provider([envs, myOrgEnv]: MyOrgEnvDeps) {
    const webpackModifiers: UseWebpackModifiers = {
      previewConfig: [previewConfigTransformer],
      devServerConfig: [devServerConfigTransformer],
    };
    const envWebpackTransform = myOrgEnv.useWebpack(webpackModifiers);
    const myEnv = myOrgEnv.compose([envWebpackTransform]);
    envs.registerEnv(myEnv);
    return new MyTeamEnvMain(myEnv);
  }
}

MyTeamEnvAspect.addRuntime(MyTeamEnvMain);
