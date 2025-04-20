import * as React from 'react';
import type { ISpfxOnboardingProps } from './ISpfxOnboardingProps';
import '../../../../assets/dist/tailwind.css';
import ProgressBar from './ProgressBar';
import OnboardingListCourses from './OnboardingListCourses';
import { useEffect, useState, useRef } from 'react';
// import { AadHttpClient } from '@microsoft/sp-http';
import CoursesBoard from './popup/CoursesBoard';

interface IListItem {
  Id: number;
  Title: string;
  field_2: string; // Assuming this is the field for email
  field_17: string; // Assuming this is the field for the onboarding name

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

const Onboarding: React.FC<ISpfxOnboardingProps> = (props) => {
  const { trainingData, onboardingName } = props;
  const modules = trainingData.data.modules;
  const learningPathInfo = trainingData.data.learningPath;

  // console.log("courses:", modules);
  // console.log("learningPathInfo:", learningPathInfo);

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isUserInList, setIsUserInList] = useState(false);

  const [isCoursesBoardVisible, setIsCoursesBoardVisible] = useState(false);

  // const [trainingDataCourses, setTrainingDataCourses] = useState<any[] | null>(null);

  const [selectedTraining, setSelectedTraining] = useState<any>();


  const popupRef = useRef<HTMLDivElement>(null); // Create a reference for the popup to detect outside clicks

  // Handle click outside of the popup to close it
  const handleClickOutside = (event: MouseEvent): void => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsCoursesBoardVisible(false);
    }
  };

  // Effect to add/remove the event listener based on the popup state
  useEffect(() => {
    if (isCoursesBoardVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCoursesBoardVisible]);



  const handleTrainingDataClick = async (trainingObject: any): Promise<void> => {
    console.log("📌 handleTrainingDataClick called with:", trainingObject);

    if (isCoursesBoardVisible) {
      setIsCoursesBoardVisible(!isCoursesBoardVisible);
      return;
    }


    try {

      setSelectedTraining(trainingObject);
      console.log("selected object:", selectedTraining);

      setIsCoursesBoardVisible(true);



    } catch (error) {
      console.error('Overall error in fetchCourseDetails:', error);
    }


  };


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
  console.log("courses:", trainingData);

  // Get unique courses from the training data
const uniqueCourses = modules.reduce((acc: any[], item: { course: string; coursePercentageComplete?: number }) => {
  const exists = acc.find((i) => i.course === item.course);
  if (!exists) {
    acc.push({
      course: item.course,
      coursePercentageComplete: item.coursePercentageComplete ?? 0 
    });
  }
  return acc;
}, []);

  return (
    <>{isUserInList && (
      <div className='w-full max-w-[960px] mx-auto m-8'>
        {/* Popup showing the CoursesBoard component */}
        {isCoursesBoardVisible && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50" onClick={() => setIsCoursesBoardVisible(false)} >
            <CoursesBoard
              ref={popupRef} // Attach the popupRef to the CoursesBoard component
              Courses={modules}
              handleTrainingDataClick={handleTrainingDataClick}
              selectedTraining={selectedTraining}

            /></div>

        )}
        <div className='flex justify-between items-start w-full text-[#3E2639]'>

          {/* Left Side - Title and Courses */}
          <div className="h-[240px] w-[446px] space-y-8 ">
            <div className="text-2xl font-semibold font-Poppins space-y-2">
              <div className="text-2xl font-semibold leading-none m-0 p-0">Your Onboarding Progress </div>
              <div className="text-xl font-medium w-[371px]">Complete these courses to finish your onboarding</div>

            </div>
            <OnboardingListCourses uniqueCoursesNames={uniqueCourses} modules={modules} handleTrainingDataClick={(trainingObject: any) => handleTrainingDataClick(trainingObject)} />
          </div>

          {/* Right Side - Card and ProgressBar */}
          <div className="relative w-[410px] h-[240px]">
            <div className="w-full h-full rounded-lg border-2 border-[#3E2639] flex items-center justify-center">
              <div className="text-3xl font-bold font-Poppins text-center">{onboardingName}
              </div>
            </div>
            {/* ProgressBar positioned on the corner */}
            <div className='absolute -translate-x-[44px] -translate-y-[86px] z-10 p-4 bg-white rounded-full'>
              <ProgressBar PercentageComplete={learningPathInfo.PercentageComplete} />
            </div>
          </div>
        </div>
      </div>
    )}
    </>

  );

}

export default Onboarding;

