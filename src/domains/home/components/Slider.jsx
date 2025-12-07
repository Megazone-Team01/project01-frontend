import { Card, CardContent } from "@/components/ui/card"
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
        image:"https://picsum.photos/1000/400",
    },
    {
        id:3,
        title:"3",
        image:"https://picsum.photos/1000/400",
    },
]




function SliderBanner() {

    return (
        <div className="w-full">
            <Carousel className="relative w-full">
                <CarouselContent className="h-full">
                    {items.map((item) => (
                        <CarouselItem key={item.id}>
                            <div className="flex justify-center items-center h-full overflow-hidden rounded-2xl">
                                <img
                                    className="relative z-10 rounded-2xl overflow-hidden max-h-full max-w-full object-cover backdrop-blur-2xl"
                                    src={item.image}
                                    alt={item.title}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="absolute left-50 bottom-10">
                    <CarouselPrevious>

                    </CarouselPrevious>
                    <CarouselNext>

                    </CarouselNext>
                </div>
            </Carousel>
        </div>

    )
}

export default SliderBanner;