import OrganizationServiceSection from "../components/OrganizationServiceSection";
import {useParams} from "react-router";
import {Separator} from "@/components/ui/separator.js";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.js";
import {useEffect, useState} from "react";
import {getOrganization} from "../api/organizationApi.js";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.js";
import {Label} from "@/components/ui/label.js";
import {Card, CardContent, CardHeader} from "@/components/ui/card.js";
import {ImageIcon} from "lucide-react";


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
                    {
                        organization.leadImage !== null ?
                        <img
                            className="aspect-square max-h-72 max-w-full"
                            src={`${import.meta.env.VITE_FILE_URL_HEADER}${organization.leadImage}`}
                            alt={id}/>
                            : <div
                                className="aspect-square max-h-72 flex justify-center items-center w-full bg-gray-50"
                            > <ImageIcon className="text-gray-400" size={25} /></div>
                    }
                </div>
                <div className="flex flex-1 flex-col justify-start items-center m-2">
                    <h2> {organization.name} </h2>
                    <Separator className="my-4" />
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-[100px]"> 강의 유형: </TableCell>
                                <TableCell>
                                    {organization.isOnline === 1 ? "온라인" : organization.isOnline === 0 ? "온라인 + 오프라인" : "오프라인" }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-[100px]"> 주소: </TableCell>
                                <TableCell> {organization.address + " " + organization.addressDetail} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-[100px]"> 홈페이지: </TableCell>
                                <TableCell> {organization.webpage} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="w-[100px]"> 전화번호: </TableCell>
                                <TableCell>
                                    {
                                        organization.tel ?
                                             organization.tel.length === 9 ?
                                                organization.tel.substring(0, 2) + "-" + organization.tel.substring(2, 5) + "-" + organization.tel.substring(5, 9)
                                                :
                                                organization.tel.length === 11 ?
                                                    organization.tel.substring(0, 3) + "-" + organization.tel.substring(3, 7) + "-" + organization.tel.substring(7, 11)
                                                    :
                                                    organization.tel
                                            :
                                            <div />
                                    }

                                </TableCell>
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