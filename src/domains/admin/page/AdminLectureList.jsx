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
import {getLectureDetail, getLectures} from "@/domains/admin/api/lectureApi.js";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.js";
import {Field, FieldLabel, FieldSet} from "@/components/ui/field.js";
import {useNavigate} from "react-router";


export const AdminLectureList = () => {
    const navigate = useNavigate();
    const [ lectures, setLectures] = useState([]);

    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ formData, setFormData ] = useState({
        createdAt: '',
        updatedAt: '',
        deletedAt: ''
    })

    const displayDetail = async ( id, isOnline ) => {
        const data = await getLectureDetail( id, isOnline ? 1 : 0 );
        setFormData( data );

        setInfoOpen( true );
    }

    useEffect(() => {
        const fetchLecture = async () => {
            const data = await getLectures();
            setLectures(data);
        }
        fetchLecture();
    }, []);

    return (
        <Card className="w-full min-h-80 bg-white">
            <Dialog open={infoOpen} onClose={setInfoOpen}>
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
                                                        onClick={() => displayDetail( lecture.id, lecture.online )}
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
            <DialogContent className="min-w-4/5">
                <DialogHeader>
                    <DialogTitle> 상세 정보 </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[60vh]">
                    <FieldSet>
                        <Field>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 이름: </Label>
                                        <Label className="text-md text-gray-500"> {formData.name} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 타입: </Label>
                                        <Label
                                            className="text-md text-gray-500"> {formData.online ? "온라인" : "오프라인"} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 제작: </Label>
                                        <Label className="text-md text-gray-500"> {formData.organizationName} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 강사: </Label>
                                        <Label
                                            className="text-md text-gray-500"> {formData.teacherName} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 카테고리: </Label>
                                        <Label className="text-md text-gray-500"> {formData.category} </Label>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 가격: </Label>
                                        <Label className="text-md text-gray-500"> {formData.price} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 시작일: </Label>
                                        <Label
                                            className="text-md text-gray-500"> {formData.startAt} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 종료일: </Label>
                                        <Label className="text-md text-gray-500"> {formData.endAt} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 설명: </Label>
                                        <Label
                                            className="text-md text-gray-500"> {formData.description} </Label>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 생성일: </Label>
                                        <Label
                                            className="text-md text-gray-500"> {formData.createdAt.substring(0, 10)} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 최종 수정일: </Label>
                                        <Label
                                            className="text-md text-gray-500"> {formData.updatedAt !== null ? formData.updatedAt.substring(0, 10) : ""} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <Label className="text-md font-bold"> 삭제일: </Label>
                                        <Label
                                            className="text-md text-gray-500"> {formData.deletedAt !== null ? formData.deletedAt.substring(0, 10) : ""} </Label>
                                    </div>
                                </div>
                            </div>
                        </Field>
                        <Separator className="my-2"/>
                        {
                            formData.online ?
                                <Field>
                                    <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 강의 파일: </Label>
                                            <Label
                                                onClick={ () => navigate("/online/" + formData.id ) }
                                                className="text-md text-gray-500 hover:cursor-pointer hover:text-gray-700"> 강의 파일 재생하기 </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 상태: </Label>
                                            <Label
                                                className="text-md text-gray-500"> {formData.status === 0 ? "대기중" : formData.status === 1 ? "승인" : "반려" } </Label>
                                        </div>
                                    </div>
                                </Field>
                                :
                                <Field>
                                    <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 인원 제한: </Label>
                                            <Label className="text-md text-gray-500"> {formData.maxNum} </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 강의실: </Label>
                                            <Label
                                                className="text-md text-gray-500"> {formData.roomName} </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 요일: </Label>
                                            <Label className="text-md text-gray-500"> {formData.day} </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 시작 시간: </Label>
                                            <Label className="text-md text-gray-500"> {formData.startTime} </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 종료 시간: </Label>
                                            <Label
                                                className="text-md text-gray-500"> {formData.endTime} </Label>
                                        </div>
                                    </div>
                                </Field>
                        }
                    </FieldSet>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setInfoOpen(false)}> 닫기 </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </Card>
    )
}

export default AdminLectureList;