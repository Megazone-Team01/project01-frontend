import SliderBanner from "@/domains/home/components/Slider.jsx";
import LectureCard from "@/components/common/LectureCard.jsx";
import useHomeLectures from "@/domains/home/hook/useHomeLectures.js";
import {TabButtons} from "@/domains/home/components/TabButtons.jsx";
import Loading from "@/components/common/loading.jsx";
import {Link} from "react-router";

export default function Home( { online } ) {
    const { lectures, isLoading } = useHomeLectures(online ? "online" : "offline");

    return (
        <div>
            <SliderBanner/>
            <div>
                <div className="w-full mb-5 pt-5 pb-3">
                    <h1 className="font-medium md:text-4xl text-2xl mx-auto max-w-3xl px-4">
                        신규 강의
                    </h1>
                </div>

                <div className="flex flex-col gap-3.5  min-px-24">
                     <div className="w-full lg:w-4xl mx-auto grid lg:grid-cols-3 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                         {!isLoading ? lectures?.map((lecture) => (
                             <Link to={`/lecture/${ online ? "online" : "offline"}/${lecture.id}`} key={lecture.id}>
                                 <LectureCard
                                     imgUrl={lecture.thumbnail}
                                     title={lecture.title}
                                     description={lecture.description}
                                 />
                             </Link>
                         )): <Loading />}
                    </div>
                </div>
            </div>
        </div>
    )
}

