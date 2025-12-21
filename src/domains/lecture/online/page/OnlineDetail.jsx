import {useLocation, useParams} from "react-router";
import {Badge} from "@/components/ui/badge.js";
import {formatDate, lectureStatus} from "@/lib/utils.js";
import EducationPeriod from "@/domains/lecture/components/common/EducationPeriod.jsx";
import {AlertBox} from "@/domains/lecture/components/common/AlertBox.jsx";
import Loading from "@/components/common/loading.jsx";
import useLectureDetail from "@/domains/lecture/hook/useLectureDetail.js";
import {Separator} from "@/components/ui/separator.js";
import OrganizationCard from "@/domains/lecture/components/common/OrganizationCard.jsx";

function OnlineDetail() {
    // useParams()로 URL 변수 받기
    const {onlineId} = useParams();
    const location = useLocation();
    const lectureType = location.pathname.includes("/online") ? "online" : "offline";
    const {data, isLoading} = useLectureDetail(onlineId, lectureType);



    if (isLoading) {
        return <Loading />;
    }

    console.log("data", data)
    return (
        <div className="max-w-screen-lg mx-auto p-2">
            <div className="flex flex-col gap-5 sm:grid sm:grid-cols-[1fr_2fr]">
                <img
                    src="https://picsum.photos/400/200"
                    alt="thumbnail"
                    className="w-[400px] h-[300px] object-cover"
                />
                <div>
                    <section className="flex gap-2 mb-2">
                        <Badge className="rounded-none p-1 font-medium">{lectureType}</Badge>
                        {data?.category && (
                            <Badge className="rounded-none bg-orange-400 p-1 font-medium">
                                {data.category}
                            </Badge>
                        )}
                    </section>

                    <section className="flex flex-col gap-3">
                        <div className="my-2 flex justify-start items-center gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="font-medium text-4xl">{data.name}</h1>
                                    <div
                                        className={`inline text-white rounded-sm ${
                                            lectureStatus(data.startAt, data.endAt) === "강의 종료"
                                                ? "bg-red-400"
                                                : lectureStatus(data.startAt, data.endAt) === "모집중"
                                                    ? "bg-blue-500"
                                                    : "bg-neutral-600"
                                        }`}
                                    >
                                        <Badge className="bg-transparent text-xl">
                                            {lectureStatus(data.startAt, data.endAt)}
                                        </Badge>
                                    </div>

                                </div>
                                <p>{data.description}</p>
                            </div>

                        </div>

                        <div>
                            <div className="p-2 min-h-[150px] bg-neutral-100 border-black rounded-2xl">
                                <ul className="flex flex-col mb-3">
                                    <li>강사: {data.teacherName}</li>
                                    <li>아카데미: {data.organizationName}</li>
                                    <li>가격: {data.price}</li>
                                    <EducationPeriod
                                        startAt={data.startAt}
                                        endAt={data.endAt}
                                        formatDate={formatDate}
                                    />
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex gap-2">
                                    <AlertBox
                                        text={"강의 신청"}
                                        startAt={data.startAt}
                                        endAt={data.endAt}
                                        lectureId={onlineId}
                                        lectureType={lectureType}
                                    />
                                    <AlertBox
                                        text={"강의취소"}
                                        startAt={data.startAt}
                                        endAt={data.endAt}
                                        lectureId={onlineId}
                                        lectureType={lectureType}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Separator className="my-3.5"/>
            <section>
                <OrganizationCard
                    name={data.organizationName}
                    description={data.organizationDescription}/>
            </section>

        </div>

    );
}

export default OnlineDetail;