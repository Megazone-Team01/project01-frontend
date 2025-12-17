import {
    Field, FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet
} from "@/components/ui/field.js";
import {Input} from "@/components/ui/input.js";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText
} from "@/components/ui/input-group.js";
import {RadioGroup} from "@radix-ui/react-radio-group";
import {RadioGroupItem} from "@/components/ui/radio-group.js";
import {Checkbox} from "@/components/ui/checkbox.js";
import {Label} from "@/components/ui/label.js";
import {Button} from "@/components/ui/button.js";
import {Textarea} from "@/components/ui/textarea.js";
import {MoreHorizontal, Search} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "@/components/ui/dialog.js";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {Separator} from "@/components/ui/separator.js";
import {ScrollArea} from "@/components/ui/scroll-area.js";
import {Popover} from "@/components/ui/popover.js";
import {Empty, EmptyTitle} from "@/components/ui/empty.js";
import {getCategories} from "@/domains/admin/api/categoryApi.js";
import {getOrganizations, getTeacherInOrganization} from "@/domains/admin/api/organizationApi.js";
import {getRooms} from "@/domains/admin/api/roomApi.js";


export const AdminLectureCreatePage = () => {
    const [ userOpen, setUserOpen ] = useState(false);
    const [ organizationOpen, setOrganizationOpen ] = useState(false);
    const [ categoryOpen, setCategoryOpen ] = useState(false);
    const [ roomOpen, setRoomOpen ] = useState(false);

    const [ organizations, setOrganizations ] = useState([]);
    const [ teachers, setTeachers ] = useState([]);
    const [ rooms, setRooms ] = useState([]);

    const [ first, setFirst ] = useState([]);
    const [ second, setSecond ] = useState([]);
    const [ third, setThird ] = useState([]);
    const [ fourth, setFourth ] = useState([]);
    const [ fifth, setFifth ] = useState([]);


    const [ isOnline, setIsOnline ] = useState( true );

    const [ formData, setFormData ] = useState({
        name: '',
        organizationId: '',
        organizationName: '',
        teacherId: '',
        teacherName: '',
        roomId: '',
        roomName: '',
        category: '',
        description: '',
        type: ''
    })

    const changeOnOff = ( isOnline ) => {
        setFormData( { ...formData, type: isOnline } );
        setIsOnline( isOnline === 1 );
    }

    const refreshCategory = async ( parentId, code, position ) => {
        const data = await getCategories( parentId );
        if( position === 1 ){
            setSecond( data )
            setThird( [] )
            setFourth( [] )
            setFifth( [] )
        }
        else if( position === 2 ){
            setThird( data )
            setFourth( [] )
            setFifth( [] )
        }
        else if( position === 3 ){
            setFourth( data )
            setFifth( [] )
        }
        else if( position === 4 ){
            setFifth( data )
        }

        setFormData( { ...formData, category: code })
    }

    const selectOrganization = async ( organizationId, organizationName ) => {
        setFormData( { ...formData, organizationId: organizationId, organizationName: organizationName } );

        await Promise.all([
            loadTeachers( organizationId ),
            loadRooms( organizationId )
        ])
        setOrganizationOpen( false )
    }
    const loadTeachers = async ( organizationId ) => {
        const data = await getTeacherInOrganization( organizationId );
        setTeachers( data );
    }
    const loadRooms = async ( organizationId ) => {
        const data = await getRooms( organizationId );
        setRooms( data )
    }

    const selectTeacher = async ( teacherId, teacherName ) => {
        setFormData( { ...formData, teacherId: teacherId, teacherName: teacherName } );
        setUserOpen( false )
    }

    const selectRoom = async ( roomId, roomName ) => {
        setFormData( { ...formData, roomId: roomId, roomName: roomName } );
        setRoomOpen( false )
    }

    useEffect(() => {
        const fetchData = async () => {
            const categoryData = await getCategories( null );
            setFirst( categoryData );

            const organizationData = await getOrganizations();
            setOrganizations( organizationData );
        }
        fetchData();
    }, []);

    return (
        <div>
            <Dialog open={roomOpen} onClose={() => setRoomOpen(false)}>
            <Dialog open={userOpen} onClose={() => setUserOpen(false)}>
            <Dialog open={organizationOpen} onClose={() => setOrganizationOpen(false)}>
            <Dialog open={categoryOpen} onClose={() => setCategoryOpen(false)}>
                <Card className="bg-white">
                    <CardContent>
                        <form>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend className="font-bold"> 강의 추가 </FieldLegend>
                                    <FieldDescription> 새로운 강의를 추가합니다 </FieldDescription>
                                    <Field className="flex">
                                        <FieldLabel> 이름 </FieldLabel>
                                        <Input
                                            value={formData.name}
                                            onChange={ (e) => setFormData( { ...formData, name: e.target.value } ) }
                                            placeholder="이름을 입력하세요" required/>
                                    </Field>
                                    <Field className="flex">
                                        <FieldLabel> 기관 </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                value={formData.organizationName}
                                                placeholder="기관을 선택해주세요" disabled/>
                                            <InputGroupAddon align="inline-end">
                                                <DialogTrigger>
                                                    <InputGroupButton onClick={() => setOrganizationOpen(true)}
                                                                      className="hover:cursor-pointer" variant="ghost">
                                                        <MoreHorizontal/>
                                                    </InputGroupButton>
                                                </DialogTrigger>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field className="flex">
                                        <FieldLabel> 강사 </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                value={formData.teacherName}
                                                placeholder="강사를 선택해주세요" disabled/>
                                            <InputGroupAddon align="inline-end">
                                                <DialogTrigger>
                                                    <InputGroupButton onClick={() => setUserOpen(true)}
                                                                      className="hover:cursor-pointer" variant="ghost">
                                                        <MoreHorizontal/>
                                                    </InputGroupButton>
                                                </DialogTrigger>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {
                                            formData.organizationName.length < 1 ?
                                                <FieldDescription className="text-red-500"> 기관 선택이 완료되어야 목록이 나옵니다. </FieldDescription> : ""
                                        }
                                    </Field>
                                    <Field orientation="horizontal">
                                        <FieldLabel> 카테고리 </FieldLabel>
                                        <FieldDescription>
                                            {formData.category}
                                        </FieldDescription>
                                        <Button onClick={() => setCategoryOpen(true)} type="button"
                                                className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer"
                                                variant="outline"> 카테고리 지정 </Button>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="feedback"> 소개 </FieldLabel>
                                        <Textarea
                                            id="feedback"
                                            placeholder="기관에 대해 설명해주세요"
                                            rows={4}
                                            value={formData.description}
                                            onChange={ (e) => setFormData( { ...formData, description: e.target.value } ) }
                                        />
                                    </Field>
                                    <div className="w-full max-w-md">
                                        <FieldLabel> 유형 </FieldLabel>
                                        <RadioGroup className="pt-3 flex" defaultValue="online">
                                            <Field orientation="horizontal">
                                                <RadioGroupItem
                                                    onClick={() => changeOnOff( 1 ) }
                                                    value="online" id="plan-monthly"
                                                />
                                                <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                                    온라인
                                                </FieldLabel>
                                            </Field>
                                            <Field orientation="horizontal">
                                                <RadioGroupItem
                                                    onClick={() => changeOnOff( 2 ) }
                                                    value="offline" id="plan-monthly"/>
                                                <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                                    오프라인
                                                </FieldLabel>
                                            </Field>
                                        </RadioGroup>
                                    </div>
                                </FieldSet>
                                <FieldSeparator/>
                                <FieldSet>
                                {
                                    isOnline ?
                                        <div>
                                            <Field>
                                                <FieldLabel> 강의 영상 </FieldLabel>
                                                <Input
                                                    type="file" />
                                            </Field>
                                        </div>
                                        :
                                        <div>
                                            <Field className="pb-4">
                                                <FieldLabel> 수강생 제한 </FieldLabel>
                                                <Input
                                                    value={formData.maxNum}
                                                    onChange={ (e) => setFormData( { ...formData, maxNum: e.target.value } ) }
                                                    type="number" placeholder="1" min="1" />
                                            </Field>
                                            <Field className="pb-4">
                                                <FieldLabel> 강의실 </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        value={formData.roomName}
                                                        placeholder="강의실을 선택해주세요" disabled/>
                                                    <InputGroupAddon align="inline-end">
                                                        <DialogTrigger asChild>
                                                            <InputGroupButton onClick={() => setRoomOpen(true)}
                                                                              className="hover:cursor-pointer" variant="ghost">
                                                                <MoreHorizontal/>
                                                            </InputGroupButton>
                                                        </DialogTrigger>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {
                                                    formData.organizationName.length < 1 ?
                                                        <FieldDescription className="text-red-500"> 기관 선택이 완료되어야 목록이 나옵니다. </FieldDescription> : ""
                                                }
                                            </Field>
                                            <Field>
                                                <FieldLabel> 강의 시간 </FieldLabel>
                                                <FieldContent>
                                                    <div className="flex gap-2">
                                                        <div className="w-1/5 grid grid-cols-4">
                                                            <div className="flex gap-1">
                                                                <Checkbox onClick={() => setFormData(
                                                                    { ...formData, day: "월" }
                                                                )}/>
                                                                <Label> 월 </Label>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Checkbox onClick={() => setFormData(
                                                                    { ...formData, day: "화" })}
                                                                />
                                                                <Label> 화 </Label>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Checkbox onClick={() => setFormData(
                                                                    { ...formData, day: "수" })}
                                                                />
                                                                <Label> 수 </Label>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Checkbox onClick={() => setFormData(
                                                                    { ...formData, day: "목" })}
                                                                />
                                                                <Label> 목 </Label>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Checkbox onClick={() => setFormData(
                                                                    { ...formData, day: "금" })}
                                                                />
                                                                <Label> 금 </Label>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Checkbox onClick={() => setFormData(
                                                                    { ...formData, day: "토" })}
                                                                />
                                                                <Label> 토 </Label>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Checkbox onClick={() => setFormData(
                                                                    { ...formData, day: "일" })}
                                                                />
                                                                <Label> 일 </Label>
                                                            </div>

                                                        </div>
                                                        <div className="flex flex-col w-1/5">
                                                            <p className="text-center pb-2"> 시작 </p>
                                                            <Input
                                                                value={formData.startTimeAt}
                                                                onChange={ (e) => setFormData( { ...formData, startTimeAt: e.target.value } ) }
                                                                className="justify-center" type="time" step="1" defaultValue="09:00:00" />
                                                        </div>
                                                        <div className="flex flex-col w-1/5">
                                                            <p className="text-center pb-2"> 종료 </p>
                                                            <Input
                                                                value={formData.endTimeAt}
                                                                onChange={ (e) => setFormData( { ...formData, endTimeAt: e.target.value } ) }
                                                                className="justify-center" type="time" step="1"
                                                                   defaultValue="10:00:00"/>
                                                        </div>
                                                    </div>

                                                </FieldContent>
                                            </Field>
                                        </div>
                                }
                                </FieldSet>
                                <FieldSeparator/>
                                <FieldSet>
                                    <Field>
                                        <FieldLabel> 개인 정보 수집 동의 </FieldLabel>
                                        <Card className="bg-gray-50">
                                            <CardContent>
                                                <div className="text-sm">
                                                    위 총칙ㄷ 어쩌고 저쩌고
                                                    위 총칙ㄷ 어쩌고 저쩌고
                                                    위 총칙ㄷ 어쩌고 저쩌고
                                                    위 총칙ㄷ 어쩌고 저쩌고
                                                    위 총칙ㄷ 어쩌고 저쩌고
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <div className="flex justify-center items-center gap-3">
                                            <Checkbox id="terms"/>
                                            <Label htmlFor="terms"> 위 내용에 동의합니다 </Label>
                                        </div>
                                    </Field>
                                </FieldSet>
                                <Field className="justify-center" orientation="horizontal">
                                    <Button className="bg-green-500" type="submit"> 생성 </Button>
                                    <Button variant="outline" type="button"> 취소 </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
                <DialogContent className="w-full max-w-2/3">
                    <DialogHeader> 카테고리 </DialogHeader>
                    <Separator/>
                    <div className="flex flex-col w-full">
                        <div className="flex gap-1">
                            <InputGroup>
                                <InputGroupInput/>
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                            </InputGroup>
                            <Button variant="ghost" className="hover:cursor-pointer hover:bg-gray-50 hover:text-gray-400"> 검색 </Button>
                        </div>
                        <div className="flex w-full gap-2">
                            <Card className="flex-1 py-3 my-2 bg-gray-50">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">
                                        {
                                            first.map( (category, index) => (
                                                <p
                                                    key={index}
                                                    className="text-sm hover:cursor-pointer hover:font-bold"
                                                    onClick={ () => refreshCategory( category.id, category.code, 1 ) }
                                                > { category.name } </p>
                                            ))
                                        }
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-100">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">
                                        {
                                            second.map( (category, index) => (
                                                <p key={index} className="text-sm hover:cursor-pointer hover:font-bold"
                                                   onClick={ () => refreshCategory( category.id, category.code,2 ) }
                                                > { category.name } </p>
                                            ))
                                        }
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-200">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">
                                        {
                                            third.map( (category, index) => (
                                                <p key={index} className="text-sm hover:cursor-pointer hover:font-bold"
                                                   onClick={ () => refreshCategory( category.id, category.code,3 ) }
                                                > { category.name } </p>
                                            ))
                                        }
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-300">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">
                                        {
                                            fourth.map( (category, index) => (
                                                <p key={index} className="text-sm hover:cursor-pointer hover:font-bold"
                                                   onClick={ () => refreshCategory( category.id, category.code,4 ) }
                                                > { category.name } </p>
                                            ))
                                        }
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-400">
                                <CardContent>
                                    {
                                        fifth.map( (category, index) => (
                                            <p key={index} className="text-sm hover:cursor-pointer hover:font-bold"> { category.name } </p>
                                        ))
                                    }
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setCategoryOpen(false)} variant="outline" type="submit"> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
                <DialogContent className="w-full max-w-1/2" >
                    <DialogHeader> 기관 조회 </DialogHeader>
                    <div className="flex justify-center items-center gap-4">
                        <InputGroup>
                            <InputGroupInput />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                        <Button variant="ghost"> 검색 </Button>
                    </div>
                    <div className="text-center">
                        <div className="w-full max-h-[50vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] text-center"> ID </TableHead>
                                    <TableHead className="w-[200px] text-center"> 이름 </TableHead>
                                    <TableHead className="text-center"> 대표 </TableHead>
                                    <TableHead className="w-[80px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    organizations.length > 0 ?
                                        organizations.map( (organization, index) => (
                                                <TableRow key={index} className="hover:bg-white">
                                                    <TableCell> { organization.id } </TableCell>
                                                    <TableCell> { organization.name } </TableCell>
                                                    <TableCell> { organization.ownerName } </TableCell>
                                                    <TableCell
                                                        className="hover:cursor-pointer hover:text-gray-400"
                                                        onClick={() => selectOrganization( organization.id, organization.name ) }
                                                    > 선택 </TableCell>
                                                </TableRow>
                                            ))
                                    :
                                    ""
                                }

                            </TableBody>
                        </Table>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setOrganizationOpen(false)} variant="outline" type="submit"> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
                <DialogContent className="w-full max-w-1/2" >
                    <DialogHeader> 강사 조회 </DialogHeader>
                    <div className="flex justify-center items-center gap-4">
                        <InputGroup>
                            <InputGroupInput />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                        <Button variant="ghost"> 검색 </Button>
                    </div>
                    <div className="text-center">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] text-center"> ID </TableHead>
                                    <TableHead className="w-[200px] text-center"> 이름 </TableHead>
                                    <TableHead className="text-center"> 소속 </TableHead>
                                    <TableHead className="w-[80px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    teachers.length > 0 ?
                                        teachers.map( (teacher, index) => (
                                            <TableRow key={index} className="hover:bg-white">
                                                <TableCell> { teacher.id } </TableCell>
                                                <TableCell> { teacher.userName } </TableCell>
                                                <TableCell> { teacher.organizationName } </TableCell>
                                                <TableCell
                                                    className="hover:cursor-pointer hover:text-gray-400"
                                                    onClick={() => selectTeacher( teacher.id, teacher.userName )}
                                                > 선택 </TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        ""
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setUserOpen(false)} variant="outline" type="submit"> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
                <DialogContent className="w-full max-w-1/2" >
                    <DialogHeader> 강의실 조회 </DialogHeader>
                    <div className="flex justify-center items-center gap-4">
                        <InputGroup>
                            <InputGroupInput />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                        <Button variant="ghost"> 검색 </Button>
                    </div>
                    <div className="text-center">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] text-center"> ID </TableHead>
                                    <TableHead className="w-[200px] text-center"> 이름 </TableHead>
                                    <TableHead className="w-[80px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    rooms.length > 0 ?
                                        rooms.map( (room, index) => (
                                            <TableRow key={index} className="hover:bg-white">
                                                <TableCell> { room.id } </TableCell>
                                                <TableCell> { room.name } </TableCell>
                                                <TableCell
                                                    className="hover:cursor-pointer hover:text-gray-400"
                                                    onClick={() => selectRoom( room.id, room.name )}
                                                > 선택 </TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        ""
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setRoomOpen(false)} variant="outline" type="submit"> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default AdminLectureCreatePage;