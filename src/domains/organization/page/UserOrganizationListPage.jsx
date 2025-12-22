import OrganizationCard from "../components/OrganizationCard.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.js";
import {useEffect, useState} from "react";
import {getOrganizations, getOrganizationsWithFilter} from "../api/organizationApi.js";
import {useNavigate} from "react-router";



export const UserOrganizationListPage = () => {
    const [ organizations, setOrganizations ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

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

    const searchFilter = async ( select ) => {
        setLoading(true);
        if( select !== 3 ) {
            const data = await getOrganizationsWithFilter( { isOnline: select } );
            setOrganizations( data );
        }
        else {
            const data = await getOrganizations();
            setOrganizations( data );
        }
        setLoading(false);
    }

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div>
            <div className="row p-3 flex">
                <div className="w-1/3">
                    <p className="text-left font-bold text-2xl"> 아카데미 </p>
                </div>
                <div className="w-2/3">
                    <Select onValueChange={(value) => searchFilter(value)}>
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="전체"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={3}> 전체 </SelectItem>
                            <SelectItem value={1}> 온라인 </SelectItem>
                            <SelectItem value={2}> 오프라인 </SelectItem>
                            <SelectItem value={0}> 온라인 + 오프라인 </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-3">
                {
                    organizations.map( (organization, index) => (
                        <OrganizationCard onClick={() => navigate("/organization/" + organization.id)} key={index} organization={organization} />
                    ))
                }
            </div>
        </div>

    );
}

export default UserOrganizationListPage;