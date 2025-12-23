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
import {adminUpdateUser, deleteUser, getUserDetail, getUsers, getUsersWithFilter} from "@/domains/admin/api/userApi.js";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.js";
import {Field, FieldLabel, FieldSet} from "@/components/ui/field.js";
import {Input} from "@/components/ui/input.js";


export const AdminUserList = () => {
    const [ users, setUsers ] = useState([]);
    const [ filter, setFilter ] = useState({
        type: null,
        userRole: null,
        searchString: null
    });
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        addressDetail: '',
        roleName: '',
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        fileUrl: '',
        lectures: [],
        organizations: []
    })

    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ isUpdating, setUpdating ] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUsers();
            setUsers(data);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUsersWithFilter(  filter );
            setUsers(data);
        }
        fetchUser();
    }, [ filter ]);

    const deleteById = async ( id, deletedBy ) => {
        const flag = confirm( "사용자를 삭제하시겠습니까?" )
        if( flag ) {
            const data = await deleteUser( id, deletedBy );
            if( data.status === 200 ){
                alert( "삭제되었습니다" )

                const res = await getUsers();
                setUsers(res);
            }
        }
    }

    const openUpdate = async ( id ) => {
        const data = await getUserDetail( id );
        setFormData( {
            ...formData,
            id: id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            addressDetail: data.addressDetail,
            roleName: data.roleName,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
            lectures: data.lectures,
            organizations: data.organizations,
            fileUrl: data.profileImage
        })
        setUpdating(true);
        setInfoOpen(true);
    }
    const submitUpdate = async () => {
        const data = {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            addressDetail: formData.addressDetail
        };
        if( data.name.length === 0 || data.phone.length !== 11 ){
            alert( "이름과 전화번호는 필수입니다. 형식에 맞게 입력해주세요" )
            return
        }

        const res = await adminUpdateUser(formData.id, {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            addressDetail: formData.addressDetail,
            type: formData.type,
            fileId: null
        })
        alert( "수정되었습니다" )
        window.location.reload();
    }
    const closeModal = () => {
        setFormData( {
            ...formData,
            name: '',
            phone: '',
            address: '',
            addressDetail: ''
        })
        setInfoOpen(false);
        setUpdating(false);
    }

    const openDetail = async ( id ) => {
        const data = await getUserDetail( id );
        setFormData( {
            ...formData,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            addressDetail: data.addressDetail,
            roleName: data.roleName,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
            lectures: data.lectures,
            organizations: data.organizations,
            fileUrl: data.fileUrl
        })
        setUpdating(false);
        setInfoOpen(true);
    }

    return (
        <Card className="w-full min-h-80 bg-white">
            <Dialog open={infoOpen} onClose={setInfoOpen} >
            <CardHeader>
                <CardTitle> 사용자 목록 조회 </CardTitle>
                <Separator className="my-2" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col pb-4">
                    <div className="flex gap-3">
                        <InputGroup>
                            <InputGroupInput
                                onChange={ (e) => setFilter({ ...filter, searchString: e.target.value } ) }
                                placeholder="Search..."/>
                            <InputGroupAddon>
                                <Search/>
                            </InputGroupAddon>
                        </InputGroup>
                        <Button className="hover:cursor-pointer"
                                type="button"
                                variant="ghost"> 검색 </Button>
                    </div>
                    <div className="flex p-2">
                        <h3 className="pr-3"> 역할 </h3>
                        <RadioGroup className="flex" defaultValue="all">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, userRole: null } ) }
                                    value="all" id="r1"/>
                                <Label htmlFor="r1"> 전체 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, userRole: "STUDENT" } ) }
                                    value="student" id="r2"/>
                                <Label htmlFor="r2"> 학생 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, userRole: "TEACHER" } ) }
                                    value="teacher" id="r3"/>
                                <Label htmlFor="r3"> 강사 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, userRole: "ADMIN" } ) }
                                    value="admin" id="r3"/>
                                <Label htmlFor="r3"> 관리자 </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex p-2">
                        <h3 className="pr-3"> 유형 </h3>
                        <RadioGroup className="flex" defaultValue="all">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, type: null } ) }
                                    value="all" id="r1"/>
                                <Label htmlFor="r1"> 전체 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, type: 1 } ) }
                                    value="online" id="r2"/>
                                <Label htmlFor="r2"> 온라인 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, type: 2 } ) }
                                    value="offline" id="r3"/>
                                <Label htmlFor="r3"> 오프라인 </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    onClick={ () => setFilter( { ...filter, type: 0 } ) }
                                    value="both" id="r3"/>
                                <Label htmlFor="r3"> 온/오프라인 </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {
                    users.length === 0 ?
                        <Empty>
                            <EmptyTitle> 사용자가 존재하지 않습니다 </EmptyTitle>
                        </Empty>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-white">
                                    <TableHead className="w-[70px] text-center"> 사용자 ID </TableHead>
                                    <TableHead className="text-center"> 이름 </TableHead>
                                    <TableHead className="text-center"> 역할 </TableHead>
                                    <TableHead className="text-center"> 전화번호 </TableHead>
                                    <TableHead className="text-center"> 주소 </TableHead>
                                    <TableHead className="text-center"> 상태 </TableHead>
                                    <TableHead className="w-[300px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    users.map((user, index) => (
                                        <TableRow key={index} className="hover:bg-white">
                                            <TableCell className="text-center"> {user.id} </TableCell>
                                            <TableCell className="text-center"> {user.name} </TableCell>
                                            <TableCell className="text-center">
                                                {user.roleName}
                                            </TableCell>
                                            <TableCell className="text-center"> {user.phone} </TableCell>
                                            <TableCell className="text-center"> {user.address + " " + user.addressDetail} </TableCell>
                                            <TableCell className="text-center"> {user.deleted ? "삭제됨" : "활성화"} </TableCell>
                                            <TableCell className="text-center flex justify-center">
                                                <ButtonGroup>
                                                    <Button className="bg-white text-green-500 hover:bg-white hover:font-bold hover:cursor-pointer"
                                                        onClick={ () => openUpdate( user.id ) }
                                                    > 수정 </Button>
                                                    <Button className="bg-white text-red-500 hover:bg-white hover:font-bold hover:cursor-pointer"
                                                        onClick={ () => deleteById( user.id )}
                                                    > 삭제 </Button>
                                                    <Button
                                                        onClick={() => openDetail( user.id )}
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
                        <DialogTitle> 사용자 상세 조회</DialogTitle>
                        <Separator className="my-2"/>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh]">
                        <FieldSet>
                            <Field>
                                <div className="flex items-center gap-3 pr-5">
                                    {
                                        formData.fileUrl !== null && formData.fileUrl !== undefined ?
                                            <img className="flex-1 max-w-1/3"
                                                 src={`${import.meta.env.VITE_FILE_URL_HEADER}${formData.fileUrl}`}
                                                alt={`${import.meta.env.VITE_FILE_URL_HEADER}${formData.fileUrl}`}
                                            />
                                            :
                                            <div className="flex-1 max-w-1/3 aspect-square bg-gray-100 border" />
                                    }
                                    <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                        <div className="flex gap-2 w-full flex-1 items-center">
                                            <Label className="flex-2 text-md font-bold"> 이름: </Label>
                                            {
                                                isUpdating ?
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData( { ...formData, name: e.target.value })}
                                                        className="flex-5 rounded-none"
                                                    />
                                                    :
                                                    <Label
                                                        className="flex-5 text-md text-gray-500"> {formData.name} </Label>
                                            }
                                        </div>
                                        <div className="flex gap-2 w-full flex-1 items-center">
                                            <Label className="flex-2 text-md font-bold"> 이메일: </Label>
                                            <Label className="flex-5 text-gray-500"> {formData.email} </Label>
                                        </div>
                                        <div className="flex gap-2 w-full flex-1 items-center">
                                            <Label className="flex-2 text-md font-bold"> 전화번호: </Label>
                                            {
                                                isUpdating ?
                                                    <Input
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData( { ...formData, phone: e.target.value })}
                                                        className="flex-5 rounded-none"
                                                    />
                                                    :
                                                    <Label
                                                        className="flex-5 text-md text-gray-500"> {formData.phone}  </Label>
                                            }
                                        </div>

                                        <div className="flex gap-2 w-full flex-1 items-center">
                                            <Label className="flex-2 text-md font-bold"> 역할: </Label>
                                            <Label className="flex-5 text-md text-gray-500"> {formData.roleName} </Label>
                                        </div>
                                        <div className="flex gap-2 w-full flex-1 items-center">
                                            <Label className="flex-2 text-md font-bold"> 주소: </Label>
                                            {
                                                isUpdating ?
                                                    <div className="flex flex-5 flex-col gap-2">
                                                        <Input
                                                            value={formData.address}
                                                            onChange={(e) => setFormData( { ...formData, address: e.target.value })}
                                                            className="flex-5 rounded-none"
                                                        />
                                                        <Input
                                                            value={formData.addressDetail}
                                                            onChange={(e) => setFormData( { ...formData, addressDetail: e.target.value })}
                                                            className="flex-5 rounded-none"
                                                        />
                                                    </div>
                                                    :
                                                    <div className="flex flex-5 flex-col gap-2">
                                                        <Label
                                                            className="text-md text-gray-500"> {formData.address} </Label>
                                                        <Label
                                                            className="text-md text-gray-500"> {formData.addressDetail} </Label>
                                                    </div>
                                            }
                                        </div>
                                    </div>

                                </div>
                                <Field>
                                    <div className="flex items-center gap-3 pr-5">
                                        <div className="flex-1 max-w-1/3"/>
                                        <div className="flex flex-1 flex-col items-start gap-4 pl-5">
                                            <div className="flex gap-2 w-full flex-1 items-center">
                                                <Label className="flex-2 text-md font-bold"> 생성일: </Label>
                                                <Label
                                                    className="flex-5 text-md text-gray-500"> {formData.createdAt.substring(0, 10)} </Label>
                                            </div>
                                            <div className="flex w-full gap-2 flex-1 items-center">
                                                <Label className="flex-2 text-md font-bold"> 최종 수정일: </Label>
                                                <Label
                                                    className="flex-5 text-md text-gray-500"> {formData.updatedAt !== null ? formData.updatedAt.substring(0, 10) : ""} </Label>
                                            </div>
                                            <div className="flex w-full gap-2 flex-1 items-center">
                                                <Label className="flex-2 text-md font-bold"> 삭제일: </Label>
                                                <Label
                                                    className="flex-5 text-md text-gray-500"> {formData.deletedAt !== null ? formData.deletedAt.substring(0, 10) : ""} </Label>
                                            </div>
                                        </div>
                                    </div>
                                </Field>
                            </Field>
                            <Separator className="my-2"/>
                            <Field>
                                <FieldLabel className="text-md font-bold"> 소속 기관 </FieldLabel>
                                <div className="flex flex-col gap-2">
                                    {
                                        formData.organizations.map((name, index) => (
                                            <Label key={index + "_1"}> {name}</Label>
                                        ))
                                    }
                                </div>
                            </Field>
                            <Separator className="my-2"/>
                            <Field>
                                <FieldLabel className="text-md font-bold">
                                    {formData.roleName === "TEACHER" ? "담당 강의" : "수강 강의"}
                                </FieldLabel>
                                <div className="flex flex-col gap-2">
                                    {
                                        formData.lectures.map((name, index) => (
                                            <Label key={index + "_1"}> {name}</Label>
                                        ))
                                    }
                                </div>
                            </Field>
                        </FieldSet>
                    </div>
                    <DialogFooter>
                        {
                            isUpdating ? <Button onClick={() => submitUpdate()}
                                                 variant="outline" className="border-green-500 text-green-500 hover:text-green-700 hover:bg-green-100"> 수정 </Button> : ""
                        }
                        <Button onClick={() => closeModal()} variant="outline"> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default AdminUserList;