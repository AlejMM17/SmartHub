"use client"

import Image from "next/image";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from "react";
import useSkills from "@/hooks/useSkills";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import ActivitiesDialogCloseButton from "../ActivitiesDialogCloseButton";
import { Slider } from "@/components/ui/slider"


export function FollowingPointerDemoActivity({ activity, activityID, projectID, scores}) {
    const [skillsFetched, setSkillsFetched] = useState([]);
    const { getSkillById, loading, error } = useSkills();
    const status = getActivityStatus(activity.start_date, activity.end_date);
    const [imageUrl, setImageUrl] = useState("/defaultPFP.webp");
    const [isHovered, setIsHovered] = useState(false);
    const [displayContent, setDisplayContent] = useState(true);

    useEffect(() => {
      const fetchSkills = async () => {
          try {
              if (activity.skills && Array.isArray(activity.skills)) {
                  const skillPromises = activity.skills.map((skill) =>
                      getSkillById(skill.skill_id)
                  );

                  const fetchedSkills = await Promise.all(skillPromises);

                  setSkillsFetched(fetchedSkills);
              }
          } catch (err) {
              console.error("Error fetching skills:", err);
          }
      };

      fetchSkills();
  }, [activity.skills]); 

    useEffect(() => {
        if (activity.activity_picture && activity.activity_picture.data) {
            const blob = new Blob([new Uint8Array(activity.activity_picture.data.data)], { type: activity.activity_picture.contentType });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
        }
    }, [activity.activity_picture]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleTouchStart = () => setIsHovered(true);
    const handleTouchEnd = () => setIsHovered(false);

    useEffect(() => {
        if (isHovered) {
            setTimeout(() => setDisplayContent(false), 0);
        } else {
            setDisplayContent(true);
        }
    }, [isHovered]);

    return (
        <div
            className="md:w-80 mx-auto w-80 lg:mx-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            >
            <div className="h-full">
                <div
                className={`relative h-full rounded-2xl transition-all duration-300 group bg-white hover:shadow-xl border border-zinc-100 flex flex-col justify-between min-h-[400px] ${isHovered ? 'max-h-[800px]' : 'max-h-[600px]'}`}
                >
                {/* Image Section */}
                <div className="w-full h-40 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden relative">
                    <Image
                    src={imageUrl}
                    alt="thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-95 transform transition duration-200"
                    />
                </div>

                     {/* Content Section */}
                    <div className="flex flex-1 flex-col justify-between p-4 gap-y-4 relative">
                        <div
                        className={`transition-all duration-300 ${isHovered ? 'opacity-0 translate-y-[-100%] absolute' : 'opacity-100 translate-y-0 relative'}`}
                        >
                        {/* Status */}
                        <div>
                            <div className="flex items-center gap-x-2 mb-2">
                            <span
                                className={`w-3 h-3 rounded-full ${
                                activity.status === 'Pendiente' ? 'bg-red-600' : 'bg-green-600'
                                }`}
                            />
                            <p>{activity.status}</p>
                            </div>

                            <div className="flex flex-row flex-wrap gap-2 my-2">
                            {!loading &&
                                Array.isArray(skillsFetched) &&
                                skillsFetched.length > 0 &&
                                skillsFetched.map((skill, i) => (
                                <Badge key={skill._id}>
                                    {skill.name} - {activity.skills[i].percentage + '%'}
                                </Badge>
                                ))}
                            </div>

                            <h2 className="font-bold mb-2 text-lg text-zinc-700">{activity.name}</h2>
                            <p className="font-normal text-sm text-zinc-500">{activity.description}</p>
                        </div>
                        </div>
                        <div
                        className={`transition-all duration-300 w-full ${
                            isHovered ? 'translate-y-0 opacity-100 relative' : 'translate-y-[100%] opacity-0 absolute'
                        }`}
                        >
                        <h2 className="font-bold mb-2 text-lg text-zinc-700 ms-5">Scores</h2>
                        <div className="flex flex-col flex-wrap gap-2 w-full max-h-96 overflow-y-auto">
                            {scores.map((score, i) => (
                            <div
                                key={score.skill_id}
                                className="flex flex-col items-center w-full"
                            >
                                <Badge>
                                {skillsFetched.find((skill) => skill._id === score.skill_id)
                                    ?.name +
                                    ' - ' +
                                    score.score}
                                </Badge>
                                <div
                                className={'flex flex-row flex-wrap gap-2 my-2 w-60'}
                                >
                                <Slider
                                    defaultValue={[score.score]}
                                    max={10}
                                    step={0}
                                />
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                        {/* Footer */}
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col mb-5">
                                <span className="text-sm text-gray-500">
                                    Desde: <b>{formatDate(activity.start_date)}</b>
                                </span>
                                <span className="text-sm text-gray-500">
                                    Fins: <b>{formatDate(activity.end_date)}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
};

const getActivityStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
        return "Pendiente";
    } else if (now > end) {
        return "Finalizada";
    } else {
        return "Activa";
    }
};

