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

export function FollowingPointerDemo({ activity, activityID, handleDeleteActivity, handleModifyActivity, formData, setFormData, projectID }) {
    const [skillsFetched, setSkillsFetched] = useState([]);
    const { getSkillById, loading, error } = useSkills();
    const status = getActivityStatus(activity.start_date, activity.end_date);

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

    return (
        <div className="w-80">
            <div className="h-full">
                <div className="relative h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100 flex flex-col justify-between min-h-[400px]">
                    {/* Image Section */}
                    <div className="w-full h-40 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden relative">
                        <Image
                            src={"/defaultPFP.webp"}
                            alt="thumbnail"
                            layout="fill"
                            objectFit="cover"
                            className="group-hover:scale-95 transform transition duration-200"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col justify-between p-4 gap-y-4">
                        {/* Status */}
                        <div>
                            <div className="flex items-center gap-x-2 mb-2">
                                <span className={`w-3 h-3 rounded-full ${status === "Pendiente" ? "bg-red-600" : "bg-green-600"}`} />
                                <p>{status}</p>
                            </div>

                            <div className="flex flex-row flex-wrap gap-2 my-2">
                                {!loading && Array.isArray(skillsFetched) && skillsFetched.length > 0 && skillsFetched.map((skill, i) => (
                                    <Badge key={skill._id}>
                                        {skill.name} - {activity.skills[i].percentage + "%"}
                                    </Badge>
                                ))}
                            </div>

                            <h2 className="font-bold mb-2 text-lg text-zinc-700">
                                {activity.name}
                            </h2>
                            <p className="font-normal text-sm text-zinc-500">
                                {activity.description}
                            </p>
                            
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
                            <div className="flex flex-row gap-1 justify-between">
                                <div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <ActivitiesDialogCloseButton
                                                setFormData={setFormData}
                                                formData={formData}
                                                clickFunction={() => handleModifyActivity(activityID)}
                                                title="Modificar Actividad"
                                                description="Modifica todos los datos requeridos para modificar una actividad."
                                                action="Modify"
                                                activityID={activityID}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Modificar Actividad</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Link href={`/professor/projects/${projectID}/${activityID}`}><Button variant="outline"><ArrowRight /></Button></Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Ir a Actividad</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Button variant="destructive" onClick={() => handleDeleteActivity(activityID)}><Trash2 /></Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Eliminar Actividad</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
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

