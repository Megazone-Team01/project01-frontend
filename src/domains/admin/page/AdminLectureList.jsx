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
import {
    deleteLecture, getLectureByFilter,
    getLectureDetail,
    getLectures,
    updateLecture
} from "@/domains/admin/api/lectureApi.js";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.js";
import {Field, FieldLabel, FieldSet} from "@/components/ui/field.js";
import {useNavigate} from "react-router";
import {Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator} from "@/components/ui/breadcrumb.js";
import {Input} from "@/components/ui/input.js";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.js";
import {Calendar} from "@/components/ui/calendar.js";
import {Checkbox} from "@/components/ui/checkbox.js";


export const AdminLectureList = () => {
    const navigate = useNavigate();
    const [ lectures, setLectures] = useState([]);

    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ isUpdating, setUpdating ] = useState(false);
    const [ formData, setFormData ] = useState({
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        category: [],
        startTimeAt: '',
        endTimeAt: '',
        startAt: '',
        endAt: '',
        day: []
    })
    const [ filter, setFilter ] = useState({
        type: null,
        searchString: null
    })

    const [ startOpen, setStartOpen ] = useState(false);
    const [ endOpen, setEndOpen ] = useState(false);

    const [ selectedDays, setSelectedDays ] = useState([]);

    const displayDetail = async ( id, isOnline ) => {
        const data = await getLectureDetail( id, isOnline ? 1 : 0 );
        setFormData( data );
        setInfoOpen( true );
    }

    const removeLecture = async ( id, isOnline ) => {
        const flag = confirm( "이 강의를 삭제하시겠습니까?" )
        console.log( flag )
        if( flag ){
            const data = await deleteLecture( id, isOnline ? 1 : 0 );
            if( data.status === 200 ){
                alert( "삭제 되었습니다" )

                const ref = await getLectures();
                setLectures(ref);
            }
        }
    }

    const checkDay = (dayName, isChecked) => {
        const updatedSelectedDays = isChecked
            ? [...selectedDays, dayName]
            : selectedDays.filter(day => day !== dayName);

        setSelectedDays(updatedSelectedDays);

        setFormData(prev => ({
            ...prev,
            day: updatedSelectedDays
        }));
    }

    const openUpdateModal = async (id, isOnline) => {
        const data = await getLectureDetail( id, isOnline ? 1 : 0 );

        setSelectedDays(data.day || []);

        setFormData( { ...data, id: id, isOnline: isOnline } );
        setUpdating(true);
        setInfoOpen( true );
    }
    const closeModal = () => {
        setUpdating(false);
        setInfoOpen( false );
    }
    const submitUpdate = async () => {
        // validate
        if( formData.name.length === 0 ||
            formData.price < 10000 ||
            formData.startAt.length === 0 ||
            formData.endAt.length === 0
        ){
            alert( "필수 정보를 입력해주세요" )
            return
        }

        // update
        const res = await updateLecture( {
            ...formData,
            day: selectedDays
        } );
        if( res === 200 ){
            alert( "강의 수정이 완료되었습니다" )
            window.location.reload();
        }
    }

    useEffect(() => {
        const fetchLecture = async () => {
            const data = await getLectures();
            setLectures(data);
        }
        fetchLecture();
    }, []);

    useEffect(() => {
        const fetchLecture = async () => {
            const data = await getLectureByFilter( filter );
            setLectures(data);
        }
        fetchLecture();
    }, [ filter ]);

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
                            <InputGroupInput
                                onChange={ (e) => setFilter( { ...filter, searchString: e.target.value })}
                                placeholder="Search..."/>
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
                                <RadioGroupItem
                                    onClick={ () => setFilter( { type: 0 } )}
                                    value="all" id="r1"/>
                                <Label htmlFor="r1"> 전체 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { type: 1 } )}
                                    value="online" id="r2"/>
                                <Label htmlFor="r2"> 온라인 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { type: 2 } )}
                                    value="offline" id="r3"/>
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
                                        <TableRow key={index}
                                          className={ lecture.deletedAt != null ? "bg-gray-400 hover:bg-gray-400" : "hover:bg-white"}
                                        >
                                            <TableCell className="text-center"> { lecture.id } </TableCell>
                                            <TableCell className="text-center"> { lecture.name } </TableCell>
                                            <TableCell className="text-center"> { lecture.organizationName } </TableCell>
                                            <TableCell className="text-center"> { lecture.teacherName } </TableCell>
                                            <TableCell className="text-center"> { lecture.online ? "온라인" : "오프라인" } </TableCell>
                                            <TableCell className="text-center flex justify-center">
                                                {
                                                    lecture.deletedAt != null ?
                                                        <div />
                                                        :
                                                        <ButtonGroup>
                                                            <Button
                                                                onClick={ () => openUpdateModal( lecture.id, lecture.online )}
                                                                className="bg-white text-green-500 hover:bg-white hover:font-bold hover:cursor-pointer"> 수정 </Button>
                                                            <Button
                                                                onClick={ () => removeLecture( lecture.id, lecture.online )}
                                                                className="bg-white text-red-500 hover:bg-white hover:font-bold hover:cursor-pointer"> 삭제 </Button>
                                                            <Button
                                                                onClick={() => displayDetail( lecture.id, lecture.online )}
                                                                className="bg-white text-black hover:bg-white hover:font-bold hover:cursor-pointer"> 정보 </Button>
                                                        </ButtonGroup>
                                                }
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
                                    <div className="flex gap-2 w-full flex-1 items-center">
                                        <Label className="flex-1 text-md font-bold"> 이름: </Label>
                                        {
                                            isUpdating ?
                                                <Input
                                                    type="text"
                                                    className="flex-5 rounded-none"
                                                    value={formData.name} />
                                                :
                                                <Label
                                                    className="flex-5 text-md text-gray-500"> {formData.name} </Label>
                                        }
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full">
                                        <Label className="text-md font-bold flex-1"> 타입: </Label>
                                        <Label
                                            className="text-md text-gray-500 flex-5"> {formData.online ? "온라인" : "오프라인"} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full">
                                        <Label className="text-md font-bold flex-1"> 제작: </Label>
                                        <Label
                                            className="text-md text-gray-500 flex-5"> {formData.organizationName} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full">
                                        <Label className="text-md font-bold flex-1"> 강사: </Label>
                                        <Label
                                            className="text-md text-gray-500 flex-5"> {formData.teacherName} </Label>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                    <div className="flex gap-2 flex-1 w-full items-center">
                                        <Label className="text-md font-bold flex-2"> 가격: </Label>
                                        {
                                            isUpdating ?
                                                <Input
                                                type="number"
                                                className="flex-5 rounded-none"
                                                value={formData.price}
                                                />
                                                :
                                                <Label className="flex-5 text-md text-gray-500"> {formData.price} </Label>
                                        }
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full items-center">
                                        <Label className="text-md font-bold flex-2"> 시작일: </Label>
                                        {
                                            isUpdating ?
                                                <Popover open={startOpen} onOpenChange={setStartOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            className="flex-5 rounded-none"
                                                            variant="outline" id="startDate"> { formData.startAt.substring(0, 10) } </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="min-w-[150px] overflow-y-hidden p-1">
                                                        <Calendar
                                                            mode="single"
                                                            className="w-full"
                                                            selected={formData.startAt}
                                                            captionLayout="dropdown"
                                                            onSelect={ (date) => {
                                                                date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                                                                setFormData( { ...formData, startAt: date.toISOString() })
                                                                setEndOpen(false)
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                :
                                                <Label
                                                    className="text-md text-gray-500 flex-5"> {formData.startAt.substring(0, 10)} </Label>
                                        }
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full items-center">
                                        <Label className="text-md font-bold flex-2"> 종료일: </Label>
                                        {
                                            isUpdating ?
                                                <Popover open={endOpen} onOpenChange={setEndOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            className="flex-5 rounded-none"
                                                            variant="outline" id="endDate"> { formData.endAt.substring(0, 10) } </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="min-w-[150px] overflow-y-hidden p-1">
                                                        <Calendar
                                                            mode="single"
                                                            className="w-full"
                                                            selected={formData.endAt}
                                                            captionLayout="dropdown"
                                                            onSelect={ (date) => {
                                                                date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                                                                setFormData( { ...formData, endAt: date.toISOString() })
                                                                setEndOpen(false)
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                :
                                                <Label className="text-md text-gray-500 flex-5"> {formData.endAt.substring(0, 10)} </Label>
                                        }
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full items-center">
                                        <Label className="text-md font-bold flex-2"> 설명: </Label>
                                        {
                                            isUpdating ?
                                                <Input
                                                    value={formData.description}
                                                    type="text"
                                                    className="flex-5 rounded-none"
                                                />
                                                :
                                                <Label
                                                    className="text-md text-gray-500 flex-5"> {formData.description} </Label>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                    <div className="flex gap-2 flex-1 w-full items-center">
                                        <Label className="text-md font-bold flex-1"> 생성일: </Label>
                                        <Label
                                            className="text-md text-gray-500 flex-5"> {formData.createdAt.substring(0, 10)} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full items-center">
                                        <Label className="text-md font-bold flex-1"> 수정일: </Label>
                                        <Label
                                            className="text-md text-gray-500 flex-5"> {formData.updatedAt !== null ? formData.updatedAt.substring(0, 10) : ""} </Label>
                                    </div>
                                    <div className="flex gap-2 flex-1 w-full items-center">
                                        <Label className="text-md font-bold flex-1"> 삭제일: </Label>
                                        <Label
                                            className="text-md text-gray-500 flex-5"> {formData.deletedAt !== null ? formData.deletedAt.substring(0, 10) : ""} </Label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex">
                                    <Label className="flex-1 text-md font-bold"> 카테고리: </Label>
                                    <Label className="flex-5 text-md text-gray-500">
                                        {
                                            formData.category.length > 1 ?
                                                formData.category.map((name, index) => (
                                                    <BreadcrumbItem>
                                                        {name} {formData.category.length > 1 ? index !== formData.category.length - 1 ? "  >  " : " " : " "}
                                                    </BreadcrumbItem>
                                                ))
                                                :
                                                <BreadcrumbItem>
                                                    {formData.category[0]}
                                                </BreadcrumbItem>
                                        }
                                    </Label>
                                </div>
                                <div className="flex-1" />
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
                                                onClick={() => navigate("/online/" + formData.id)}
                                                className="text-md text-gray-500 hover:cursor-pointer hover:text-gray-700"> 강의
                                                파일 재생하기 </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1">
                                            <Label className="text-md font-bold"> 상태: </Label>
                                            <Label
                                                className="text-md text-gray-500"> {formData.status === 0 ? "대기중" : formData.status === 1 ? "승인" : "반려"} </Label>
                                        </div>
                                    </div>
                                </Field>
                                :
                                <Field>
                                    <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                        <div className="flex gap-2 flex-1 items-center w-full">
                                            <Label className="text-md font-bold flex-1"> 인원 제한: </Label>
                                            {
                                                isUpdating ?
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        className="rounded-none flex-5"
                                                        onChange={ (e) => setFormData( { ...formData, maxNum: e.target.value })}
                                                        value={formData.maxNum} />
                                                    :
                                                    <Label className="text-md text-gray-500"> {formData.maxNum} </Label>
                                            }
                                        </div>
                                        <div className="flex gap-2 flex-1 w-full items-center">
                                            <Label className="text-md font-bold flex-1"> 강의실: </Label>
                                            <Label
                                                className="text-md text-gray-500 flex-5"> {formData.roomName} </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1 w-full items-center">
                                            <Label className="text-md font-bold flex-1"> 요일: </Label>
                                            {
                                                isUpdating ?
                                                    <div className="flex flex-5 gap-8">
                                                        <div className="flex gap-1">
                                                            <Checkbox
                                                                defaultChecked={formData.day.includes("월")}
                                                                onCheckedChange={(checked) => {
                                                                    checkDay( "월", checked )
                                                                }}
                                                            />
                                                            <Label> 월 </Label>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Checkbox
                                                                defaultChecked={formData.day.includes("화")}
                                                                onCheckedChange={(checked) => {
                                                                    checkDay( "화", checked )
                                                                }}
                                                            />
                                                            <Label> 화 </Label>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Checkbox
                                                                defaultChecked={formData.day.includes("수")}
                                                                onCheckedChange={(checked) => {
                                                                    checkDay( "수", checked )
                                                                }}
                                                            />
                                                            <Label> 수 </Label>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Checkbox
                                                                defaultChecked={formData.day.includes("목")}
                                                                onCheckedChange={(checked) => {
                                                                    checkDay( "목", checked )
                                                                }}
                                                            />
                                                            <Label> 목 </Label>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Checkbox
                                                                defaultChecked={formData.day.includes("금")}
                                                                onCheckedChange={(checked) => {
                                                                    checkDay( "금", checked )
                                                                }}
                                                            />
                                                            <Label> 금 </Label>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Checkbox
                                                                defaultChecked={formData.day.includes("토")}
                                                                onCheckedChange={(checked) => {
                                                                    checkDay( "토", checked )
                                                                }}
                                                            />
                                                            <Label> 토 </Label>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Checkbox
                                                                defaultChecked={formData.day.includes("일")}
                                                                onCheckedChange={(checked) => {
                                                                    checkDay( "일", checked )
                                                                }}
                                                            />
                                                            <Label> 일 </Label>
                                                        </div>
                                                    </div>
                                                    :
                                                    <Label
                                                        className="text-md text-gray-500 flex-5">
                                                        {formData.day.map( day => day + " ")}
                                                    </Label>
                                            }
                                        </div>
                                        <div className="flex gap-2 flex-1 w-full items-center">
                                            <Label className="text-md font-bold flex-1"> 시작 시간: </Label>
                                            <Label className="text-md text-gray-500 flex-5">
                                                {
                                                    formData.startTimeAt.length > 3 ?
                                                        formData.startTimeAt.substring(0, 2) + " : " + formData.startTimeAt.substring(2, 4)
                                                        :
                                                        null
                                                }
                                            </Label>
                                        </div>
                                        <div className="flex gap-2 flex-1 w-full items-center">
                                            <Label className="text-md font-bold flex-1"> 종료 시간: </Label>
                                            <Label
                                                className="text-md text-gray-500 flex-5">
                                                {
                                                    formData.endTimeAt.length > 3 ?
                                                        formData.endTimeAt.substring(0, 2) + " : " + formData.endTimeAt.substring(2, 4)
                                                        :
                                                        null
                                                }
                                            </Label>
                                        </div>
                                    </div>
                                </Field>
                        }
                    </FieldSet>
                </div>
                <DialogFooter>
                    {
                        isUpdating ?
                            <Button className="border-green-500 text-green-500 hover:bg-green-200 hover:text-green-700" variant="outline" onClick={() => submitUpdate()}> 수정 </Button>
                            :
                            ""
                    }
                    <Button variant="outline" onClick={() => closeModal()}> 닫기 </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </Card>
    )
}

export default AdminLectureList;