import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Separator} from "@/components/ui/separator.js";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {Button} from "@/components/ui/button.js";
import {ButtonGroup} from "@/components/ui/button-group.js";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.js";
import {Search} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.js";
import {Label} from "@/components/ui/label.js";
import {useEffect, useState} from "react";
import {getOrganizations, deleteOrganization, getOrganizationDetail} from "@/domains/admin/api/organizationApi.js";
import {Empty, EmptyMedia, EmptyTitle} from "@/components/ui/empty.js";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.js";
import {Field, FieldLabel, FieldSet} from "@/components/ui/field.js";


export const AdminOrganizationList = () => {
    const [ organizations, setOrganizations ] = useState([]);

    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ formData, setFormData ] = useState({
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        teachers: [],
        students: []
    })

    const deleteById = async ( id ) => {
        const flag = confirm( "이 기관을 삭제하시겠습니까?" )
        console.log( flag )
        if( flag ){
            const data = await deleteOrganization( id, 1 );
            console.log( data );
            alert( "삭제 되었습니다" )

            const ref = await getOrganizations();
            setOrganizations(ref);
        }
    }

    const displayDetail = async ( id ) => {
        const data = await getOrganizationDetail( id );
        setFormData( data )
        setInfoOpen( true );
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await getOrganizations();
            setOrganizations(data);
        }
        fetchData();
    }, [])

    console.log( formData )
    return (
        <Card className="w-full min-h-80 bg-white">
            <Dialog open={infoOpen} onClose={setInfoOpen} >
            <CardHeader>
                <CardTitle> 기관 목록 조회 </CardTitle>
                <Separator className="my-2" />
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
                        <RadioGroup className="flex" defaultValue="default">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="default" id="r1"/>
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
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="all" id="r3"/>
                                <Label htmlFor="r3"> 온/오프라인 </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {
                    organizations.length === 0 ?
                        <Empty>
                            <EmptyTitle> 기관 목록이 없습니다 </EmptyTitle>
                        </Empty>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white">
                                    <TableHead className="w-[70px] text-center"> 기관 ID </TableHead>
                                    <TableHead className="text-center"> 기관 이름 </TableHead>
                                    <TableHead className="text-center"> 대표 이름 </TableHead>
                                    <TableHead className="text-center"> 전화번호 </TableHead>
                                    <TableHead className="text-center"> 홈페이지 </TableHead>
                                    <TableHead className="w-[100px] text-center"> 유형 </TableHead>
                                    <TableHead className="w-[100px] text-center"> 상태 </TableHead>
                                    <TableHead className="w-[300px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    organizations.map((organization, index) => (
                                        <TableRow key={index} className="hover:bg-white">
                                            <TableCell className="text-center"> { organization.id } </TableCell>
                                            <TableCell className="text-center"> { organization.name } </TableCell>
                                            <TableCell className="text-center"> { organization.ownerName } </TableCell>
                                            <TableCell className="text-center"> { organization.tel } </TableCell>
                                            <TableCell className="text-center"> { organization.url } </TableCell>
                                            <TableCell className="text-center">
                                                { organization.isOnline === 0 ? "온/오프라인" :
                                                    organization.isOnline === 1 ? "온라인" : "오프라인"
                                                }
                                            </TableCell>
                                            <TableCell className="text-center"> { organization.deleted ? "삭제됨 " : "활성화" } </TableCell>
                                            <TableCell className="text-center flex justify-center">
                                                <ButtonGroup>
                                                    <Button
                                                        className="bg-white text-green-500 hover:bg-white hover:font-bold hover:cursor-pointer"> 수정 </Button>
                                                    <Button
                                                        className="bg-white text-red-500 hover:bg-white hover:font-bold hover:cursor-pointer"
                                                        onClick={ () => deleteById(organization.id) }
                                                    > 삭제 </Button>
                                                    <Button
                                                        onClick={() => displayDetail( organization.id )}
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
                <DialogContent className="min-w-2/3">
                    <DialogHeader>
                        <DialogTitle> 상세 정보 </DialogTitle>
                        <div className="overflow-y-auto max-h-[60vh]">
                            <FieldSet>
                                <Field>
                                    <div className="flex items-center gap-3">
                                        {
                                            formData.leadImage !== null ?
                                                <img className="flex-1 max-w-1/3" src={formData.profileImage}/>
                                                :
                                                <div className="w-1/3 aspect-square bg-gray-50 border"/>
                                        }
                                        <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                            <div className="flex gap-2 flex-1">
                                                <Label className="text-md font-bold"> 이름: </Label>
                                                <Label className="text-md text-gray-500"> {formData.name} </Label>
                                            </div>
                                            <div className="flex gap-2 flex-1">
                                                <Label className="text-md font-bold"> 대표자: </Label>
                                                <Label className="text-md text-gray-500"> {formData.ownerName} </Label>
                                            </div>
                                            <div className="flex gap-2 flex-1">
                                                <Label className="text-md font-bold"> 전화번호: </Label>
                                                <Label className="text-md text-gray-500"> {formData.tel} </Label>
                                            </div>
                                            <div className="flex gap-2 flex-1">
                                                <Label className="text-md font-bold"> 주소: </Label>
                                                <Label
                                                    className="text-md text-gray-500"> {formData.addressCode + " " + formData.addressDetail} </Label>
                                            </div>
                                            <div className="flex gap-2 flex-1">
                                                <Label className="text-md font-bold"> 설명: </Label>
                                                <Label className="text-md text-gray-500"> {formData.description} </Label>
                                            </div>
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
                                <Field>
                                    <FieldLabel className="text-md font-bold"> 소속 강사 </FieldLabel>
                                    <div className="flex flex-col gap-2">
                                        {
                                            formData.teachers.map( (teacher, index ) => (
                                                <Label key={index + "_1"}> { teacher } </Label>
                                            ))
                                        }
                                    </div>
                                </Field>
                                <Separator className="my-2"/>
                                <Field>
                                    <FieldLabel className="text-md font-bold">
                                        소속 학생
                                    </FieldLabel>
                                    <div className="flex flex-col gap-2">
                                        {
                                            formData.students.map((student, index) => (
                                                <Label key={index + "_2"}> {student} </Label>
                                            ))
                                        }
                                    </div>
                                </Field>
                            </FieldSet>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setInfoOpen(false)}>
                                닫기
                            </Button>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </Card>
    )

}