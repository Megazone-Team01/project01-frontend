import OrganizationServiceSection from "../components/OrganizationServiceSection";
import {useParams} from "react-router";
import {Separator} from "@/components/ui/separator.js";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.js";
import {useEffect, useState} from "react";
import {getOrganization} from "../api/organizationApi.js";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.js";
import {Label} from "@/components/ui/label.js";
import {Card, CardContent, CardHeader} from "@/components/ui/card.js";


export const UserOrganizationDetailPage = () => {
    const { id } = useParams();
    const [organization, setOrganization] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                setLoading(true);
                const org = await getOrganization(id);
                setOrganization(org);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrganization();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div className="flex flex-col w-full">
            <div className="flex w-full min-h-80">
                <div className="flex flex-1 justify-center items-center m-2">
                    <img
                        className="aspect-square max-h-72 max-w-full"
                        src={`/${organization.leadImage}`} alt={id} />
                </div>
                <div className="flex flex-1 flex-col justify-start items-center m-2">
                    <h2> {organization.name} </h2>
                    <Separator className="my-4" />
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-[100px]"> 상호명: </TableCell>
                                <TableCell> {organization.name} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-[100px]"> 강의 유형: </TableCell>
                                <TableCell> {organization.isOnline} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-[100px]"> 주소: </TableCell>
                                <TableCell> {organization.addressCode + " " + organization.addressDetail} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-[100px]"> 홈페이지: </TableCell>
                                <TableCell> {organization.webpage} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-[100px]"> 전화번호: </TableCell>
                                <TableCell> { organization.tel } </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="w-[100px]"> 소개: </TableCell>
                              <TableCell> { organization.description }  </TableCell>
                          </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <OrganizationServiceSection organizationId={Number(id)} />
        </div>
    );

}

export default UserOrganizationDetailPage;