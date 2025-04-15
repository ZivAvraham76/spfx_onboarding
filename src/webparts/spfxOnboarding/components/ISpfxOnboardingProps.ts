import { AadHttpClient } from '@microsoft/sp-http';

export interface Module {
  name: string,
  Score: number,
  Completed: boolean,
  StartDate: string | undefined,
  accessUrl: string,
}

export interface Course {
  id: string;
  adsm: string;
  name: string;
  role: string;
  originalid: number;
  levelName: string;
  completed: boolean;
  course: string;
  cid: string;
  coriginalid: number;
  accessUrl: string;
}
export interface Course1 {
  name: string;
  Complete: boolean,
  PercentageComplete: number,
  litmosLearningPathUrl: string,
  Description: string,
  Modules: Module[],
  isOptional?: boolean,
}

export interface ISpfxOnboardingProps {
  trainingData: any;
  description: string;
  backend_app_id: string;
  onboardingName: string;
  aadClient: AadHttpClient;
}

