import SliderBanner from "@/domains/home/components/Slider.jsx";
import LectureCard from "@/components/common/LectureCard.jsx";

export default function Home() {
    return (
        <div className="gap-3.5">
            <SliderBanner/>
            <div className="w-full">
                <h1 className="font-medium md:text-4xl text-2xl mx-auto max-w-3xl px-4">
                    인기 강의
                </h1>
            </div>

            <div className="flex flex-col gap-3.5  min-px-24">
            <div className="w-full lg:w-3xl mx-auto grid lg:grid-cols-3 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                    {Array.from({length: 9}).map((_, i) => (
                        <LectureCard
                            key={i}
                            imgUrl="https://picsum.photos/400/200"
                            title={`썸네일 ${i + 1}`}
                            description="description"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

