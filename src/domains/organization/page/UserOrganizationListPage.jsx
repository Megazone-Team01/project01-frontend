import axiosInstance from "../../../common/api/axiosInstance.js";
import OrganizationCard from "../components/OrganizationCard.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../components/ui/select.js";



export const UserOrganizationListPage = () => {
    return (
        <div>
            <div className="row p-3 flex">
                <div className="w-1/3">
                    <p className="text-left font-bold text-2xl"> 아카데미 </p>
                </div>
                <div className="w-2/3">
                    <Select>
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="전체"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"ALL"}> 전체 </SelectItem>
                            <SelectItem value={"ONLINE"}> 온라인 </SelectItem>
                            <SelectItem value={"OFFLINE"}> 오프라인 </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-3">
                <OrganizationCard/>
                <OrganizationCard/>
                <OrganizationCard/>
                <OrganizationCard/>
                <OrganizationCard/>
            </div>
        </div>

    );
}

export default UserOrganizationListPage;