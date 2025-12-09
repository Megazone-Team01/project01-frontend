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
        image:"https://picsum.photos/1400/500",
    },
    {   id:2,
        title:"2",
        image:"https://picsum.photos/1400/500",
    },
    {
        id:3,
        title:"3",
        image:"https://picsum.photos/1400/500",
    },
]

function SliderBanner() {

    return (
        <div className=" max-w-[1468px] mx-auto mb-20">
            <Carousel className="relative">
                <CarouselContent className="h-full">
                    {items.map((item) => (
                        <CarouselItem key={item.id}>
                            <div className="flex justify-center items-center h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden rounded-2xl">
                                <img
                                    className="relative z-10 rounded-2xl overflow-hidden h-full w-full  object-cover"
                                    src={item.image}
                                    alt={item.title}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* 중앙 정렬된 네비게이션 버튼 */}
                <div className="absolute left-1/2 md:left-1/6 -translate-x-1/2 bottom-10 flex gap-2">
                    <CarouselPrevious/>
                    <CarouselNext/>
                </div>
            </Carousel>
        </div>

    )
}

export default SliderBanner;