import SliderBanner from "@/domains/home/components/Slider.jsx";
import LectureCard from "@/components/common/LectureCard.jsx";
import {useState} from "react";
import Loading from "@/components/common/loading.jsx";
import useHomeLectures from "@/domains/home/hook/useHomeLectures.js";
import {TabButtons} from "@/domains/home/components/TabButtons.jsx";



const tabs = [
    { id: 'online', label: 'Online' },
    { id: 'offline', label: 'Offline' }
];

export default function Home() {
    const [activeTab, setActiveTab] = useState("online");
    const { lectures, isLoading } = useHomeLectures(activeTab);

    if(isLoading){
        return <Loading />
    }

    return (
        <div>
            <SliderBanner/>
            <div>
                <TabButtons
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <div className="w-full mb-5">
                    <h1 className="font-medium md:text-4xl text-2xl mx-auto max-w-3xl px-4">
                        신규 강의
                    </h1>
                </div>

                <div className="flex flex-col gap-3.5  min-px-24">
                     <div className="w-full lg:w-4xl mx-auto grid lg:grid-cols-3 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                        {lectures.map((lecture, i) => (
                            <LectureCard
                                key={i}
                                imgUrl="https://picsum.photos/400/200"
                                title={lecture.title}
                                description={lecture.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

