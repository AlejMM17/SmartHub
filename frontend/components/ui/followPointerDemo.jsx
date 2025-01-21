import Image from "next/image";
import { FollowerPointerCard } from "../ui/following-pointer";
import { Button } from '@/components/ui/button';

export function FollowingPointerDemo({ activity, activityID, handleDeleteActivity }) {
    const status = getActivityStatus(activity.start_date, activity.end_date);

    return (
    (<div className="w-80">
      <FollowerPointerCard
        title={
          <TitleComponent title={activity.name} avatar={"/defaultPFP.webp"} />
        }>
        <div
          className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
          <div
            className="w-full aspect-w-16 h-64 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
            <Image
              src={"/defaultPFP.webp"}
              alt="thumbnail"
              layout="fill"
              objectFit="cover"
              className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 `} />
          </div>
          
          <div className="p-4">
          <h2 className={"text-md"}>
                <div className="flex items-center gap-x-2">
                    <span
                        className={`w-3 h-3 rounded-full ${
                            {status} == "Pendiente" ? "bg-red-600" : "bg-green-600"
                        }`}
                    />
                    <p>{status}</p>
                </div>
            </h2>
            <h2 className="font-bold my-4 text-lg text-zinc-700">
              {activity.name}
            </h2>
            
            <h2 className="font-normal my-4 text-sm text-zinc-500">
              {activity.description}
            </h2>
            <h2 className="font-normal my-4 text-sm text-zinc-500">
              {activity.skill}
            </h2>
            <div className="flex flex-row justify-between items-center mt-10">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Desde: <b>{formatDate(activity.start_date)}</b></span>
                    <span className="text-sm text-gray-500">Fins: <b>{formatDate(activity.end_date)}</b></span>
                </div>
            <Button variant="destructive" onClick={() => handleDeleteActivity(activityID)}>Eliminar</Button>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>)
  );
}

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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

const TitleComponent = ({
  title,
  avatar
}) => (
  <div className="flex space-x-2 items-center">
    <Image
      src={avatar}
      height="20"
      width="20"
      alt="thumbnail"
      className="rounded-full border-2 border-white" />
    <p>{title}</p>
  </div>
);
