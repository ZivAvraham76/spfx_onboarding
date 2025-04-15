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
  coursePercentageComplete: number;
}

export interface ISpfxOnboardingProps {
  trainingData: any;
  description: string;
  backend_app_id: string;
  onboardingName: string;
  aadClient: AadHttpClient;
}

