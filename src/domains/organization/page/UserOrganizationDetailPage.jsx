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
    const [ organization, setOrganization ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                setLoading(true);
                const org = await getOrganization( id );
                setOrganization( org );
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
              <div className="flex w-full flex-1 justify-center items-center m-2">
                  {
                      organization.leadImage ?
                          <img
                              className="max-w-full max-h-72 aspect-ratio"
                              src={`/${organization.leadImage}`} alt={organization.leadImage}/>
                          :
                          <div className="bg-gray-50 w-full h-72" />
                  }
              </div>
              <div className="flex flex-1 flex-col justify-start items-center m-2">
                <h2> { organization.name } </h2>
                <Separator className="my-4" />
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="w-[100px]"> 상호명: </TableCell>
                            <TableCell> { organization.name } </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 강의 유형: </TableCell>
                            <TableCell> { organization.isOnline === 1 ? "온라인" : organization.isOnline === 2 ? "오프라인" : "온라인 + 오프라인" } </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 주소: </TableCell>
                            <TableCell> { organization.addressCode + " " + organization.addressDetail } </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 홈페이지: </TableCell>
                            <TableCell> { organization.webpage } </TableCell>
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
          <Separator className="my-1" />
          <div className="flex flex-col w-full min-h-96 pt-2">
              <Tabs defaultValue="lectures">
                  <div className="flex flex-1 flex-col justify-start items-center m-2">
                      <TabsList className="w-2/3 bg-gray-200 border">
                          <TabsTrigger className="w-1/2" value="introduction"> 소개 </TabsTrigger>
                          <TabsTrigger className="w-1/2" value="lectures"> 강의 </TabsTrigger>
                          <TabsTrigger className="w-1/2" value="teachers"> 강사 </TabsTrigger>
                      </TabsList>
                  </div>
                  <TabsContent value="introduction">
                      <div className="w-full bg-red-100 h-[50vh]" />
                  </TabsContent>
                  <TabsContent value="lectures">
                      <h1 className="font-bold text-xl text-center py-3"> 강의 목록 </h1>
                      <div className="grid grid-cols-3 gap-4">
                          <Card className="bg-neutral-50 hover:bg-neutral-100 hover:cursor-pointer">
                              <div className="w-full h-32 bg-red-100">

                              </div>
                              <div className="w-full h-16 bg-blue-100">

                              </div>
                          </Card>
                          <Card>
                              dfdf
                          </Card>
                          <Card>
                              dfdf
                          </Card>
                          <Card>
                              dfdf
                          </Card>
                          <Card>
                              dfdf
                          </Card>
                      </div>
                  </TabsContent>
                  <TabsContent value="teachers">
                    
                  </TabsContent>
              </Tabs>
          </div>
      </div>
    );

}

export default UserOrganizationDetailPage;