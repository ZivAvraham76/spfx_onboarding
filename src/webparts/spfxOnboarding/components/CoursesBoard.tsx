
import * as React from 'react';
import '../../../../assets/dist/tailwind.css';
import { useEffect, useState } from 'react';



// const demoCourses = ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10"];

interface IOnboardingItem {
    Id: number;
    Title: string;
    "Target Audience": string;
    "LP/Course": string;
}


const CoursesBoard = () => {

    const [courses, setCourses] = useState<IOnboardingItem[]>([]);

    useEffect(() => {
        fetchOnboardingListData();
    }, []);

    // fetch the onboarding list
    const fetchOnboardingListData = async () => {
    

    const siteUrl = "https://mosh12.sharepoint.com/sites/test-ziv";
    const onboardingListName = "Onboarding list";

    try {
        const response = await fetch(`${siteUrl}/_api/web/lists/getbytitle('${onboardingListName}')/items?$top=5000`, {
            method: "GET",
            headers: {
                "Accept": "application/json;odata=nometadata"
            }
        });

        const onboardingList = await response.json();
        console.log("OnboardingList:", onboardingList);

        setCourses(onboardingList.value);

    } catch (error) {
        console.error("Error fetching list items:", error);
    }
};


    return (
        <div className="space-y-2 max-h-28 overflow-y-auto pr-2 w-[445px]">
            {courses.map((course, index) => (
                <div
                    key={index}
                    className="w-full h-8 rounded-md border-2 border-stone-700 flex items-center justify-start text-sm font-medium text-stone-800 pl-4"
                >
                    {course.Title}
                </div>
            ))}
        </div>
    );
}
export default CoursesBoard;