
import {Card, CardDescription, CardHeader} from "../../../components/ui/card.js";

export const OrganizationCard = ( { organization, onClick } ) => {
    return (
        <Card className="bg-neutral-50 hover:bg-neutral-100 hover:cursor-pointer flex h-64"
            onClick={ onClick }
        >
            <div className="w-1/2 flex justify-center items-center">
                { /* 아카데미를 대표하는 사진을 저장하는 곳이 없음. 추후 추가되면 수정 필요 */}
                <img className="w-full h-full object-cover" src={"./test.jpeg"} alt={ organization.url }/>
            </div>
            <div className="w-1/2 h-full p-1 flex flex-col justify-center items-center">
                <p className="flex-1 flex justify-center items-center text-base font-bold" id="name">
                    {organization.name}
                </p>
                <p className="flex-1 text-sm flex justify-center items-center text-gray-500" id="isOnline">
                    {organization.isOnline}
                </p>
                <p className="flex-1 text-sm flex justify-center items-center text-gray-500" id="url">
                    {organization.url}
                </p>
                { /* Organization에 대한 description이 없음. 추가되면 수정 예정 */}
                <p className="flex-5 flex justify-center items-start text-sm overflow-hidden" id="description">
                    { organization.description }
                </p>
            </div>
        </Card>
    );
}

export default OrganizationCard;