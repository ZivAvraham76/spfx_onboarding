import * as React from 'react';
import type { ISpfxOnboardingProps } from './ISpfxOnboardingProps';
import '../../../../assets/dist/tailwind.css';
import ProgressBar from './ProgressBar';
import CoursesBoard from './CoursesBoard';
import { useEffect, useState } from 'react';

interface IListItem {
  Id: number;
  Title: string;
  field_2: string; // Assuming this is the field for email
}

interface IUser {
  Id: number;
  IsHiddenInUI: boolean;
  LoginName: string;
  Title: string;
  PrincipalType: number;
  Email: string;
  UserPrincipalName: string;
}

const Onboarding: React.FC<ISpfxOnboardingProps> = () => {

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isUserInList, setIsUserInList] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchHiresListData();
    }
  }, [currentUser]);

  // fetch the curr user
  const fetchCurrentUser = async () => {
    const siteUrl = "https://mosh12.sharepoint.com/sites/test-ziv";

    try {
      const response = await fetch(`${siteUrl}/_api/web/currentuser`, {
        method: "GET",
        headers: {
          "Accept": "application/json;odata=nometadata"
        }
      });

      const data = await response.json();
      setCurrentUser(data);
      console.log("Current User:", data);

    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };


  // fetch the hires list
  const fetchHiresListData = async () => {
    const siteUrl = "https://mosh12.sharepoint.com/sites/test-ziv";
    const HiresListName = "New Hires assigned";

    try {
      const response = await fetch(`${siteUrl}/_api/web/lists/getbytitle('${HiresListName}')/items?$top=5000`, {
        method: "GET",
        headers: {
          "Accept": "application/json;odata=nometadata"
        }
      });

      const hiresList = await response.json();
      console.log("hiresList:", hiresList);

      // check if the user in the list
      const userFound = hiresList.value.some((item: IListItem) => {
        if (!currentUser?.UserPrincipalName || !item.field_2) return false;

        const currentUserPrefix = currentUser.UserPrincipalName.split('@')[0].toLowerCase();
        const itemPrefix = item.field_2.split('@')[0].toLowerCase();

        return currentUserPrefix === itemPrefix;
      }
      );
      console.log("curruser:", currentUser);

      setIsUserInList(userFound);
      console.log("Is user in list?", userFound);

    } catch (error) {
      console.error("Error fetching list items:", error);
    }
  };


  return (
    <>{isUserInList && (
      <div className='w-full max-w-[960px] mx-auto m-8'>
        <div className='flex justify-between items-start w-full'>

          {/* Left Side - Title and Courses */}
          <div className="h-[240px] w-[446px] space-y-8 ">
            <div className="text-black text-2xl font-semibold font-Poppins space-y-2">
              <div className="text-2xl font-semibold leading-none m-0 p-0">Your Onboarding Progress </div>
              <div className="text-xl font-medium w-[371px]">Complete these courses to finish your onboarding</div>

            </div>
            <CoursesBoard />
          </div>

          {/* Right Side - Card and ProgressBar */}
          <div className="relative w-[410px] h-[240px]">
            <div className="w-full h-full rounded-lg border-2 border-[#3E2639] flex items-center justify-center">
              <div className="text-[#3E2639] text-3xl font-bold font-Poppins text-center">Onboarding Programs
              </div>
            </div>
            {/* ProgressBar positioned on the corner */}
            <div className='absolute bottom-0 left-0 -translate-x-1/2 z-10 pt-4 bg-white'>
              <ProgressBar PercentageComplete={40} />
            </div>
          </div>
        </div>
      </div>
    )}
    </>

  );

}

export default Onboarding;

