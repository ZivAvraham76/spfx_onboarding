import '../../../../assets/dist/tailwind.css';
import * as React from "react";
import { Course } from "./ISpfxOnboardingProps";


interface CourseLineProps {
  course: Course;
  handleTrainingDataClick: (trainingObject: any) => void;
}

const CourseLine: React.FC<CourseLineProps> = ({ course, handleTrainingDataClick }) => {
  console.log(course, "courseLine");
  return (
  <div
  className="w-full h-8 rounded-md border-2 border-[#3E2639] flex items-center justify-between text-sm font-medium text-[#3E2639] px-4"
  onClick={() => handleTrainingDataClick(course.course)}
>
  <div>{course.course}</div>
  <div>{course.coursePercentageComplete} %</div>
</div>
  );
};

export default CourseLine;