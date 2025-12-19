import {AlertBox} from "@/domains/lecture/components/common/AlertBox.jsx";
import {Badge} from "@/components/ui/badge.js";
import EducationPeriod from "@/domains/lecture/components/common/EducationPeriod.jsx";

const LectureDetail = ({ data, lectureType, lectureStatus, formatDate }) => {
    // 데이터가 없을 경우를 대비한 예외 처리
    if (!data) return null;

    // 상태에 따른 배경색 로직을 변수로 분리하여 가독성을 높였습니다.
    const status = lectureStatus(data.startAt, data.endAt);
    const statusBgColor =
        status === "강의 종료" ? "bg-red-400" :
            status === "모집중" ? "bg-blue-500" : "bg-neutral-600";

    return (
        <div className="max-w-screen-lg mx-auto p-2">
            <div className="flex flex-col gap-5 sm:grid sm:grid-cols-[1fr_2fr]">
                {/* 썸네일 이미지 */}
                <img
                    src={data.thumbnailUrl || "https://picsum.photos/400/200"}
                    alt="thumbnail"
                    className="w-full h-[300px] object-cover rounded-lg"
                />

                <div>
                    {/* 카테고리 및 타입 배지 */}
                    <section className="flex gap-2 mb-2">
                        <Badge className="rounded-none p-1 font-medium">{lectureType}</Badge>
                        {data.category && (
                            <Badge className="rounded-none bg-orange-400 p-1 font-medium">
                                {data.category}
                            </Badge>
                        )}
                    </section>

                    <section className="flex flex-col gap-3">
                        {/* 제목 및 강의 상태 */}
                        <div className="my-2 flex flex-wrap justify-start items-center gap-2">
                            <h1 className="font-medium text-4xl">{data.name}</h1>
                            <div className={`inline text-white rounded-sm ${statusBgColor}`}>
                                <Badge className="bg-transparent text-xl">
                                    {status}
                                </Badge>
                            </div>
                        </div>

                        {/* 세부 정보 리스트 */}
                        <div>
                            <div className="p-4 min-h-[150px] bg-neutral-100 border border-neutral-200 rounded-2xl">
                                <ul className="flex flex-col gap-2 mb-3 text-lg">
                                    <li><strong>강사:</strong> {data.teacherName}</li>
                                    <li><strong>아카데미:</strong> {data.organizationName}</li>
                                    <li><strong>가격:</strong> {data.price?.toLocaleString()}원</li>
                                    <li><strong>수강정원:</strong> {data.maxNum}명</li>
                                    <EducationPeriod
                                        startAt={data.startAt}
                                        endAt={data.endAt}
                                        formatDate={formatDate}
                                    />
                                </ul>
                            </div>
                        </div>

                        {/* 신청 버튼 영역 */}
                        <div>
                            <AlertBox
                                text={"강의 신청"}
                                startAt={data.startAt}
                                endAt={data.endAt}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default LectureDetail;