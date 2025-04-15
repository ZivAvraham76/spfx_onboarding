import '../../../../assets/dist/tailwind.css';
import * as React from "react";
import { Course } from "./ISpfxOnboardingProps";


interface CourseLineProps {
  course: Course;
  handleTrainingDataClick: (trainingObject: any) => void;
}

const CourseLine: React.FC<CourseLineProps> = ({ course, handleTrainingDataClick }) => {
  return (
  <div
  className="w-full h-8 rounded-md border-2 border-stone-700 flex items-center justify-start text-sm font-medium text-stone-800 pl-4"
  onClick={() => handleTrainingDataClick(course)}
>
  {course}
</div>
  );
};

export default CourseLine;