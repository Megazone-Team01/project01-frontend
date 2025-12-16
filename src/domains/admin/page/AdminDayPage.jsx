import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {ButtonGroup} from "@/components/ui/button-group.js";
import {Button} from "@/components/ui/button.js";


export const AdminDayPage = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold"> 요일 태그 관리 </h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center"> 요일 </TableHead>
                        <TableHead className="text-center"> 요일값 </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                    <TableRow className="hover:bg-white">
                        <TableCell> 1 </TableCell>
                        <TableCell> 1 </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="flex w-full justify-end">
                <ButtonGroup>
                    <Button className="bg-green-500 text-white" variant="default"> 추가 </Button>
                    <Button className="bg-gray-500 text-white" variant="default"> 변경 </Button>
                    <Button className="bg-red-500 text-white" variant="default"> 삭제 </Button>
                </ButtonGroup>
            </div>
        </div>
    )
}

export default AdminDayPage;