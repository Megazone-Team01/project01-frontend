import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


const items = [
    {
        id:1,
        title:"1",
        image:"./main1.png",
    },
    {   id:2,
        title:"2",
        image:"./main2.png",
    },
    {
        id:3,
        title:"3",
        image:"./main3.png",
    },
]

function SliderBanner() {

    return (
        <div className=" max-w-[70vw] mx-auto ">
            <Carousel className="relative bottom-5">
                <CarouselContent className="h-full">
                    {items.map((item) => (
                        <CarouselItem key={item.id}>
                            <div className="flex justify-center items-center h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden rounded-2xl">
                                <img
                                    className="relative z-10 rounded-2xl overflow-hidden w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
                                    src={item.image}
                                    alt={item.title}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* 중앙 정렬된 네비게이션 버튼 */}
                <div className="absolute left-1/2 md:left-1/6 -translate-x-1/2 bottom-25 flex gap-2">
                    <CarouselPrevious/>
                    <CarouselNext/>
                </div>
            </Carousel>
        </div>

    )
}

export default SliderBanner;