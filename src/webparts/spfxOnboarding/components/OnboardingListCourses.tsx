import * as React from 'react';
import '../../../../assets/dist/tailwind.css';
import CourseLine from './Card';

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

interface OnboardingListCoursesProps {
    uniqueCoursesNames: any[];
    handleTrainingDataClick: (trainingObject: any) => void;
    modules: any[];
}

const OnboardingListCourses: React.FC<OnboardingListCoursesProps> = ({uniqueCoursesNames,handleTrainingDataClick,modules}) => {

    return (
        <div className="space-y-2 max-h-28 overflow-y-auto pr-2 w-[445px]">
            {uniqueCoursesNames.map((course, index) => (
                // <div
                //     key={index}
                //     className="w-full h-8 rounded-md border-2 border-stone-700 flex items-center justify-start text-sm font-medium text-stone-800 pl-4"
                //     onClick={() => handleTrainingDataClick(course)}
                // >
                //     {course}
                // </div>
                <CourseLine
                    key={index}
                    course={course}
                    handleTrainingDataClick={(trainingObject: any) => handleTrainingDataClick(trainingObject)}
                />        
            ))}
        </div>
    );
}
export default OnboardingListCourses;
