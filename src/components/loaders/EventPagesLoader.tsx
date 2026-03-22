import { Skeleton } from "../ui/skeleton";
import EventCardLoaderContainer from "./EventCardLoader";

export default function EventPageLoader(){
    return (
        <div className="">
            <Skeleton
                className={`w-[70%] h-28 md:h-34 lg:h-48 bg-secondary-6 flex justify-end items-end rounded-t-0 rounded-bl-0 rounded-br-[45px] md:rounded-br-[105px] lg:rounded-br-[130px] pt-10 pb-3 md:pb-5 px-10 md:px-20 lg:px-28`}
            />

            <div className="global-px my-6">
                <EventCardLoaderContainer />
            </div>
        </div>
    )
}