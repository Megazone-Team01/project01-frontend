import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Separator} from "@/components/ui/separator.js";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {ButtonGroup} from "@/components/ui/button-group.js";
import {Button} from "@/components/ui/button.js";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.js";
import {Search} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.js";
import {Label} from "@/components/ui/label.js";
import {useEffect, useState} from "react";
import {Empty, EmptyTitle} from "@/components/ui/empty.js";
import {getLectures} from "@/domains/admin/api/lectureApi.js";


export const AdminLectureList = () => {
    const [ lectures, setLectures] = useState([]);

    useEffect(() => {
        const fetchLecture = async () => {
            const data = await getLectures();
            setLectures(data);
        }
        fetchLecture();
    }, []);

    return (
        <Card className="w-full min-h-80 bg-white">
            <CardHeader>
                <CardTitle> 강의 목록 조회 </CardTitle>
                <Separator className="my-2"/>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col pb-4">
                    <div className="flex gap-3">
                        <InputGroup>
                            <InputGroupInput placeholder="Search..."/>
                            <InputGroupAddon>
                                <Search/>
                            </InputGroupAddon>
                        </InputGroup>
                        <Button className="hover:cursor-pointer" variant="ghost"> 검색 </Button>
                    </div>
                    <div className="flex p-2">
                        <h3 className="pr-3"> 유형 </h3>
                        <RadioGroup className="flex" defaultValue="all">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="all" id="r1"/>
                                <Label htmlFor="r1"> 전체 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="online" id="r2"/>
                                <Label htmlFor="r2"> 온라인 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="offline" id="r3"/>
                                <Label htmlFor="r3"> 오프라인 </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {
                    lectures.length === 0 ?
                        <Empty>
                            <EmptyTitle> 강의가 존재하지 않습니다 </EmptyTitle>
                        </Empty>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white">
                                    <TableHead className="w-[70px] text-center"> 강의 ID </TableHead>
                                    <TableHead className="text-center"> 강의 이름 </TableHead>
                                    <TableHead className="text-center"> 소속 기관 </TableHead>
                                    <TableHead className="text-center"> 강사 </TableHead>
                                    <TableHead className="w-[100px] text-center"> 유형 </TableHead>
                                    <TableHead className="w-[300px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    lectures.map( (lecture, index) => (
                                        <TableRow key={index} className="hover:bg-white">
                                            <TableCell className="text-center"> { lecture.id } </TableCell>
                                            <TableCell className="text-center"> { lecture.name } </TableCell>
                                            <TableCell className="text-center"> { lecture.organizationName } </TableCell>
                                            <TableCell className="text-center"> { lecture.teacherName } </TableCell>
                                            <TableCell className="text-center"> { lecture.online ? "온라인" : "오프라인" } </TableCell>
                                            <TableCell className="text-center flex justify-center">
                                                <ButtonGroup>
                                                    <Button
                                                        className="bg-white text-green-500 hover:bg-white hover:font-bold hover:cursor-pointer"> 수정 </Button>
                                                    <Button
                                                        className="bg-white text-red-500 hover:bg-white hover:font-bold hover:cursor-pointer"> 삭제 </Button>
                                                    <Button
                                                        className="bg-white text-black hover:bg-white hover:font-bold hover:cursor-pointer"> 정보 </Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                            </TableBody>
                        </Table>
                }
        </CardContent>
</Card>
)
}

export default AdminLectureList;