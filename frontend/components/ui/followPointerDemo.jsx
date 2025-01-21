"use client"

import Image from "next/image";
import { FollowerPointerCard } from "../ui/following-pointer";
import { Button } from '@/components/ui/button';
import {useEffect, useState} from "react";
import useSkills from "@/hooks/useSkills";
import {Badge} from "@/components/ui/badge";

export function FollowingPointerDemo({ activity, activityID, handleDeleteActivity }) {
    const [skillsFetched, setSkillsFetched] = useState([])
    const { getSkillById, loading, error } = useSkills()
    const status = getActivityStatus(activity.start_date, activity.end_date);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skillPromises = activity.skills.map((skill) =>
                    getSkillById(skill.skill_id)
                );

                const fetchedSkills = await Promise.all(skillPromises);

                setSkillsFetched(fetchedSkills);
            } catch (err) {
                console.error("Error fetching skills:", err);
            }
        };

        fetchSkills();
    }, [activity.skills]);

    return (
        <div className="w-80">
            <FollowerPointerCard
                title={
                    <TitleComponent title={activity.name} avatar={"/defaultPFP.webp"} />
                }>
                <div
                    className="relative h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100 flex flex-col justify-between min-h-[400px]">
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
                                <span
                                    className={`w-3 h-3 rounded-full ${
                                        status === "Pendiente" ? "bg-red-600" : "bg-green-600"
                                    }`}
                                />
                                <p>{status}</p>
                            </div>

                            <div className="flex flex-row flex-wrap gap-2 my-2">
                                { !loading
                                    && Array.isArray(skillsFetched)
                                    && skillsFetched.length > 0
                                    && skillsFetched.map((skill, i) => (
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
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">
                                    Desde: <b>{formatDate(activity.start_date)}</b>
                                </span>
                                <span className="text-sm text-gray-500">
                                    Fins: <b>{formatDate(activity.end_date)}</b>
                                </span>
                            </div>
                            <Button
                                variant="destructive"

                                onClick={() => handleDeleteActivity(activityID)}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            </FollowerPointerCard>
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

const TitleComponent = ({ title, avatar }) => (
    <div className="flex space-x-2 items-center">
        <Image
            src={avatar}
            height="20"
            width="20"
            alt="thumbnail"
            className="rounded-full border-2 border-white"
        />
        <p>{title}</p>
    </div>
);
