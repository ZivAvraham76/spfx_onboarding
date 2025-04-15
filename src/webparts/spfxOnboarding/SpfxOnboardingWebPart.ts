import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'SpfxOnboardingWebPartStrings';
import SpfxOnboarding from './components/SpfxOnboarding';
import { ISpfxOnboardingProps } from './components/ISpfxOnboardingProps';
import { AadHttpClient, HttpClientResponse } from "@microsoft/sp-http";

export interface ISpfxOnboardingWebPartProps {
  description: string;
  backend_app_id: string;
}

interface Course {
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

export default class SpfxOnboardingWebPart extends BaseClientSideWebPart<ISpfxOnboardingWebPartProps> {
  private Client: AadHttpClient;
  private trainingData: { data: Course[] };
  private onboardingName: string;

  public render(): void {
    if(!this.properties.backend_app_id){
      this.domElement.innerHTML = `<p>No backend_app_id</p>`;
      return;
    }

    if (!this.trainingData) {
      this.domElement.innerHTML =
      `<div class="flex justify-center items-center h-full w-full">
      <button disabled type="button" class="text-white bg-[#41273c]  hover:bg-[#896f85] hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
</svg>
Loading...
</button>
</div>`;
      this.getUserOnboardingName()
        .then(onboardingName => {
          if (!onboardingName) {
            this.domElement.innerHTML = `<p>User not found in onboarding list</p>`;
            return;
          }

          this.onboardingName = onboardingName;
  
          const fullUrl = encodeURI(`http://localhost:3000/sp-data/4sp/${onboardingName}`);
          console.log("📡 Fetching from:", fullUrl);
  
          return this.Client.get(fullUrl, AadHttpClient.configurations.v1);
        })
        .then((response: HttpClientResponse) => {
          if (!response) {
            throw new Error("No response returned");
          }
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          console.log("📥 Response:", response);
          return response.json();
        })
        .then((data) => {
          if (!data) return;
          this.trainingData = data;
          console.log("✅ FULL response from backend:", data);;
          this.render();
        })
        .catch(err => {
          console.error("❌ Error loading onboarding data:", err);
        
          this.domElement.innerHTML = `<p>Error loading onboarding data</p>`;
        });
  
      return;
    }
  
    const element: React.ReactElement<ISpfxOnboardingProps> = React.createElement(
      SpfxOnboarding,
      {
        description: this.properties.description,
        backend_app_id: this.properties.backend_app_id,
        trainingData: this.trainingData,
        onboardingName: this.onboardingName,
        aadClient: this.Client,
      }
    );
  
    ReactDom.render(element, this.domElement);
  }
  

  private async getUserOnboardingName(): Promise<string | null> {
    const siteUrl = "https://mosh12.sharepoint.com/sites/test-ziv";
    const listName = "New Hires assigned";

    try {
      const userRes = await fetch(`${siteUrl}/_api/web/currentuser`, {
        method: "GET",
        headers: { "Accept": "application/json;odata=nometadata" }
      });
      const currentUser = await userRes.json();

      const listRes = await fetch(`${siteUrl}/_api/web/lists/getbytitle('${listName}')/items?$top=5000`, {
        method: "GET",
        headers: { "Accept": "application/json;odata=nometadata" }
      });
      const list = await listRes.json();

      const matched = list.value.find((item: any) => {
        if (!currentUser?.UserPrincipalName || !item.field_2) return false;
        const userPrefix = currentUser.UserPrincipalName.split('@')[0].toLowerCase();
        const itemPrefix = item.field_2.split('@')[0].toLowerCase();
        console.log("matched?", matched)
        return userPrefix === itemPrefix;
      });
      console.log("test:",matched)

      return matched?.field_17 || null;

    } catch (error) {
      console.error("Error checking onboarding list:", error);
      return null;
    }
  }

  protected onInit(): Promise<void> {
    return this.context.aadHttpClientFactory
      .getClient(`api://${this.properties.backend_app_id}/`)
      .then((client: AadHttpClient) => {
        this.Client = client;
      });
  }
  

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected onPropertyPaneFieldChanged(propertyPath: string): void {
    if (propertyPath === "description") {
      this.render();
    }
    if (propertyPath === "backend_app_id") {
      this.onInit().catch(err => console.error(err));
    }
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;

    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty("--bodyText", semanticColors.bodyText || null);
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty("--linkHovered", semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("backend_app_id", {
                  label: "Backend App ID"
                }),
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
