import {AspectRatio} from "@/components/ui/aspect-ratio.js";
import {File, FileIcon} from "lucide-react";

function LectureCard({id,imgUrl, title, description}) {

    return (
        <AspectRatio ratio={14 / 14}>
            <div
                key={id}
                className="relative w-full h-full">
                {imgUrl ? <img
                    src={`${import.meta.env.VITE_FILE_URL_HEADER}${imgUrl}`}
                    alt={imgUrl}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />: <div className="w-full h-full flex justify-center items-center text-gray-500"> <FileIcon size={40} /> </div>}
                <div className="absolute bottom-0 left-0 w-full p-3 bg-black/50 text-white rounded-b-lg">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
        </AspectRatio>

    )
}

export default LectureCard;