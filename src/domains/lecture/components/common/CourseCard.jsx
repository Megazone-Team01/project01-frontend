import {AspectRatio} from "@/components/ui/aspect-ratio.js";
import {Link, useLocation} from "react-router";
import {Badge} from "@/components/ui/badge.js";
import {formatData, lectureStatus} from "@/lib/utils.js";
import {Separator} from "@/components/ui/separator.js";
import {Button} from "@/components/ui/button.js";

function CourseCard({id,imgUrl, title, description, startAt, endAt}) {

    const location = useLocation();
    const type = location.pathname.includes("online") ? "online" : "offline";
    return (
        <AspectRatio ratio={9 / 16} className="place-items-start">
            <Link to={`/lecture/${type}/${id}`}
                  className="block h-full border-2 cursor-pointer">
                <div className="w-full h-full grid grid-rows-2 overflow-hidden shadow-2xl">
                    <div className="w-full h-full">
                        <img
                            src={imgUrl}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-black flex flex-col gap-3.5 justify-start bg-amber-50 p-3">
                        <div className="flex flex-col gap-2">
                            <div>
                                <Badge
                                    className="rounded-none w-fit px-2.5 py-1 font-medium text-xs flex justify-center items-center">
                                    오프라인
                                </Badge>
                            </div>
                            <h3 className="font-sans text-xl">
                                {title}
                            </h3>
                        </div>
                        <p className="text-sm line-clamp-2">
                            {description}
                        </p>
                        <Separator/>
                        <div className="flex flex-col justify-center  gap-3">
                            <div className="flex justify-start items-center gap-2">
                                <Badge className="hidden lg:block bg-black text-white">수강기간</Badge>
                                <div>
                                    <span>{formatData(startAt)}</span>
                                    <span>~</span>
                                    <span>{formatData(endAt)}</span>
                                </div>
                            </div>
                            <div className="flex justify-start items-center gap-2">
                                <Button variant="link" className="cursor-pointer bg-amber-50 text-black shadow-2xl border-1 border-black
                                hover:bg-none
                                ">상세보기</Button>
                                <Button variant="link" className={`cursor-pointer text-white ${
                                    lectureStatus(startAt, endAt) === "강의 종료"
                                        ? "bg-red-400"
                                        : lectureStatus(startAt, endAt) === "모집중" 
                                    ? "bg-blue-500"
                                        : "bg-neutral-600"
                                }`}>{lectureStatus(startAt, endAt)}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </AspectRatio>
    )
}

export default CourseCard;