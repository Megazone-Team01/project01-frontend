import {useParams} from "react-router";
import {Separator} from "../../../components/ui/separator.js";
import {Table, TableBody, TableCell, TableRow} from "../../../components/ui/table.js";
import {useEffect, useState} from "react";
import {getOrganization} from "../api/organizationApi.js";


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
              <div className="flex flex-1 justify-center items-center m-2">
                <img src={"../org.jpeg"} alt={id} />
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
                            <TableCell> { organization.isOnline } </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 주소: </TableCell>
                            <TableCell> { organization.addressCode + " " + organization.addressDetail } </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 홈페이지: </TableCell>
                            <TableCell> { organization.url } </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 카테고리: </TableCell>
                            <TableCell> { organization.category } </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 강의 수: </TableCell>
                            <TableCell> { organization.tel }  </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
              </div>
          </div>
          <div className="flex w-full min-h-96 bg-red-100">
              { organization.description }
          </div>
      </div>
    );

}

export default UserOrganizationDetailPage;