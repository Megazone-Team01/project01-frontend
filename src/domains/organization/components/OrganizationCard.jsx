
import {Card, CardDescription, CardHeader} from "@/components/ui/card.js";
import {FileImage} from "lucide-react";

export const OrganizationCard = ( { organization, onClick } ) => {
    return (
        <Card className="bg-neutral-50 hover:bg-neutral-100 hover:cursor-pointer rounded-none h-64 py-0"
            onClick={ onClick }
        >
            <div className="flex w-full h-full items-center justify-center">
                <div className="w-full h-full flex-1 flex justify-center items-center">
                    {
                        organization.imageUrl !== null ?
                            <img className="w-full h-full object-cover"
                                 src={`${import.meta.env.VITE_FILE_URL_HEADER}${organization.imageUrl}`}
                                 alt={`${import.meta.env.VITE_FILE_URL_HEADER}${organization.imageUrl}`}/>
                            :
                            <div>
                                <FileImage size={48} className="text-gray-300" />
                            </div>
                    }
                </div>
                <div className="flex-1 py-5 h-full flex flex-col justify-center items-center border-l-1">
                    <p className="flex-1 flex justify-center items-center text-base font-bold" id="name">
                        {organization.name}
                    </p>
                    <p className="flex-1 text-sm flex justify-center items-center text-gray-500" id="isOnline">
                        {organization.isOnline === 0 ? "온/오프라인" : organization.isOnline === 1 ? "온라인" : "오프라인" }
                    </p>
                    <p className="flex-1 text-sm flex justify-center items-center text-gray-500" id="url">
                        {organization.url}
                    </p>
                    <p className="flex-1 text-sm flex justify-center items-center text-gray-500" id="url">
                        {organization.tel !== null ?
                            organization.tel.length === 11 ?
                                organization.tel.substring(0, 3) + " - " + organization.tel.substring(3, 7) + " - " + organization.tel.substring(7, 11)
                                : organization.tel : ""
                        }
                    </p>
                    <p className="flex-5 flex justify-center items-start text-sm overflow-hidden" id="description">
                        {organization.description}
                    </p>
                </div>
            </div>
        </Card>
    );
}

export default OrganizationCard;