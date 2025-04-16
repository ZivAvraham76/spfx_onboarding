import * as React from "react";
import SingleCourse from "./SingleCourse";
import { forwardRef } from 'react';
import { Course } from "../ISpfxOnboardingProps";
// import VlpHeader from "./VlpHeader";

interface CourseBoardProps {
    Courses: Course[];
    handleTrainingDataClick: (trainingObject: any) => void;
    selectedTraining?: any;
}

const CoursesBoard = forwardRef<HTMLDivElement, CourseBoardProps>(({ Courses, handleTrainingDataClick, selectedTraining }, ref) => {

const filteredCourses = Courses.filter(
  (item) => item.course === selectedTraining
);

  const litmosLearningPathUrl = selectedTraining.accessUrl;
  // const VLP_PercentageComplete =   selectedTraining.PercentageComplete;
  // const VLP_NAME = selectedTraining.litmosLearningPathName;

  return (
    <div ref={ref} className="h-screen w-full py-10">
      <div className="mx-auto h-full w-9/12 rounded-3xl border-4 border-[#f0f2f4] bg-white px-10 py-10" onClick={(e) => e.stopPropagation()}>
        <div className="max-h-full overflow-y-auto px-5">

            <SingleCourse courseData={filteredCourses} litmosLearningPathUrl={litmosLearningPathUrl} />
        
        </div>
      </div>
    </div>
  );
  
});

export default CoursesBoard;
