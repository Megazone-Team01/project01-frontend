import OrganizationCard from "../components/OrganizationCard.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../components/ui/select.js";
import {useEffect, useState} from "react";
import {getOrganizations} from "../api/organizationApi.js";



export const UserOrganizationListPage = () => {
    const [ organizations, setOrganizations ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [error, setError] = useState(null);

    useEffect( () => {
        const fetchOrganizations = async () => {
            try {
                setLoading(true);
                const organizationList = await getOrganizations();
                setOrganizations( organizationList );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrganizations();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

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
                {
                    organizations.map( (organization, index) => (
                        <OrganizationCard key={index} organization={organization} />
                    ))
                }
            </div>
        </div>

    );
}

export default UserOrganizationListPage;