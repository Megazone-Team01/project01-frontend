
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
                            <img className="w-full h-full object-cover" src={organization.imageUrl}
                                 alt={organization.imageUrl}/>
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
                        {organization.isOnline}
                    </p>
                    <p className="flex-1 text-sm flex justify-center items-center text-gray-500" id="url">
                        {organization.url}
                    </p>
                    <p className="flex-1 text-sm flex justify-center items-center text-gray-500" id="url">
                        {organization.tel}
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