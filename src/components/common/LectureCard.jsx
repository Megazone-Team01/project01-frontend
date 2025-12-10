import {AspectRatio} from "@/components/ui/aspect-ratio.js";
import {Link} from "react-router";


function LectureCard({id,imgUrl, title, description}) {
    return (
        <AspectRatio ratio={14 / 14}>
            <Link to="#">
                <div
                    key={id}
                    className="relative w-full h-full">
                    <img
                        src={imgUrl}
                        alt="thumbnail"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-3 bg-black/50 text-white rounded-b-lg">
                        <h3 className="text-base font-semibold">{title}</h3>
                        <p className="text-sm">{description}</p>
                    </div>
                </div>
            </Link>
        </AspectRatio>

    )
}

export default LectureCard;