import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Separator} from "@/components/ui/separator.js";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {Button} from "@/components/ui/button.js";
import {ButtonGroup} from "@/components/ui/button-group.js";


export const AdminOrganizationList = () => {
    return (
        <Card className="w-full min-h-80 bg-white">
            <CardHeader>
                <CardTitle> 기관 목록 조회 </CardTitle>
                <Separator className="my-2" />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-white">
                            <TableHead className="w-[70px] text-center"> 기관 ID </TableHead>
                            <TableHead className="text-center"> 기관 이름 </TableHead>
                            <TableHead className="text-center"> 대표 이름 </TableHead>
                            <TableHead className="text-center"> 전화번호 </TableHead>
                            <TableHead className="text-center"> 홈페이지 </TableHead>
                            <TableHead className="w-[100px] text-center"> 유형 </TableHead>
                            <TableHead className="w-[300px] text-center"> 작업 </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-white">
                            <TableCell className="text-center"> 1 </TableCell>
                            <TableCell className="text-center"> 1 </TableCell>
                            <TableCell className="text-center"> 1 </TableCell>
                            <TableCell className="text-center"> 1 </TableCell>
                            <TableCell className="text-center"> 1 </TableCell>
                            <TableCell className="text-center"> 1 </TableCell>
                            <TableCell className="text-center flex justify-center">
                                <ButtonGroup>
                                    <Button className="bg-white text-green-500 hover:bg-white hover:font-bold hover:cursor-pointer"> 수정 </Button>
                                    <Button className="bg-white text-red-500 hover:bg-white hover:font-bold hover:cursor-pointer"> 삭제 </Button>
                                    <Button className="bg-white text-black hover:bg-white hover:font-bold hover:cursor-pointer"> 정보 </Button>
                                </ButtonGroup>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )

}