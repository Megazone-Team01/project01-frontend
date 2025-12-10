import {useParams} from "react-router";
import {Separator} from "../../../components/ui/separator.js";
import {Table, TableBody, TableCell, TableRow} from "../../../components/ui/table.js";


export const UserOrganizationDetailPage = () => {
    const { id } = useParams();

    return (
      <div className="flex flex-col w-full">
          <div className="flex w-full min-h-80">
              <div className="flex flex-1 justify-center items-center m-2">
                <img src={"../org.jpeg"} alt={id} />
              </div>
              <div className="flex flex-1 flex-col justify-start items-center m-2">
                <h2> 메가존 클라우드 </h2>
                <Separator className="my-4" />
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="w-[100px]"> 상호명: </TableCell>
                            <TableCell> 메가존 클라우드 </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 강의 유형: </TableCell>
                            <TableCell> 온라인 / 오프라인 </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 주소: </TableCell>
                            <TableCell> 서울특별시 서초구 역삼동 와이즈 플레이즈 2F </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 홈페이지: </TableCell>
                            <TableCell> www.magazone.com </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 카테고리: </TableCell>
                            <TableCell> IT > 프로그래밍 </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="w-[100px]"> 강의 수: </TableCell>
                            <TableCell> 12  </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
              </div>
          </div>
          <div className="flex w-full min-h-96 bg-red-100">

          </div>
      </div>
    );

}

export default UserOrganizationDetailPage;