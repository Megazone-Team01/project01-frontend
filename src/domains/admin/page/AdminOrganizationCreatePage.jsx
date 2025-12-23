import {
    Field,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.js";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {getUsersWithFilter} from "@/domains/admin/api/userApi.js";
import {createOrganization} from "@/domains/admin/api/organizationApi.js";


export const AdminOrganizationCreatePage = () => {
    const [ modalOpen, setModalOpen ] = useState(false);

    const [ formData, setFormData ] = useState({
        name: '',
        webpage: '',
        ownerId: '',
        ownerName: '',
        tel: '',
        address: '',
        addressDetail: '',
        type: '',
        description: ''
    });
    const [ allowDataCollecting, setAllowDataCollecting ] = useState(false);
    const [ teachers, setTeachers] = useState( [] );

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUsersWithFilter( {
                userRole: "TEACHER"
            });
            setTeachers(data);
        }
        fetchData();
    }, []);

    const selectTeacher = ( id, name ) => {
        setFormData( { ...formData, ownerId: id, ownerName: name } );
        setModalOpen( false );
    }

    const validate = async () => {
        // 개인 정보 동의 확인
        if( !allowDataCollecting ) return alert("개인 정보 동의는 필수입니다")
        // 빈 값이 있는지 확인
        if(
            formData.name.length === 0 ||
            formData.webpage.length === 0 ||
            formData.ownerId.length === 0 ||
            formData.tel.length === 0 ||
            formData.address.length === 0 ||
            formData.addressDetail.length === 0 ||
            formData.type.length === 0
        ) {
            alert( "빈 칸이 존재합니다" )
            console.log( formData )
            return
        }

        // 형식 확인
        if( !/^\d+$/.test( formData.tel ) ) {
            alert("전화번호는 숫자만 포함되어야 합니다")
            return
        }
        if( formData.tel.length < 9 ) {
            alert("전화번호가 올바르지 않습니다")
            return
        }

        sendData();
    }

    const sendData = async() => {
        const res = await createOrganization( formData );
        if( res === 200 ) {
            alert( "기관 생성이 완료되었습니다" )
            window.location.reload();
        }
        else alert( "기관 생성에 실패했습니다" )
    }

    return (
        <div>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogTitle>
                <Card className="bg-white">
                    <CardContent>
                        <form>

                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend> 기관 추가 </FieldLegend>
                                    <FieldDescription> 새로운 사용자를 추가합니다 </FieldDescription>
                                    <Field className="flex">
                                        <FieldLabel> 이름 </FieldLabel>
                                        <Input
                                            onChange={ (e) => setFormData( { ...formData, name: e.target.value } )}
                                            value={ formData.name }
                                            placeholder="이름을 입력하세요" required/>
                                    </Field>
                                    <Field>
                                        <FieldLabel> 홈페이지 </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                onChange={ (e) => setFormData( { ...formData, webpage: e.target.value } )}
                                                value={ formData.webpage }
                                                placeholder="example.com" className="!pl-1" />
                                            <InputGroupAddon>
                                                <InputGroupText>https://</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field className="flex">
                                        <FieldLabel> 대표자 </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                value={formData.ownerName}
                                                placeholder="대표자를 선택해주세요" disabled />
                                            <InputGroupAddon align="inline-end">
                                                <DialogTrigger asChild>
                                                    <InputGroupButton onClick={() => setModalOpen(true)} className="hover:cursor-pointer" variant="ghost">
                                                        <MoreHorizontal />
                                                    </InputGroupButton>
                                                </DialogTrigger>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field className="flex">
                                        <FieldLabel> 전화번호 </FieldLabel>
                                        <Input
                                            onChange={ (e) => setFormData( { ...formData, tel: e.target.value } )}
                                            value={ formData.tel }
                                            type="text" placeholder="01000000000" required/>
                                        <FieldDescription> -를 제외한 숫자만 입력해주세요 </FieldDescription>
                                    </Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="city"> 도로명 주소 </FieldLabel>
                                            <Input
                                                onChange={ (e) => setFormData( { ...formData, address: e.target.value } )}
                                                value={ formData.address }
                                                id="city" type="text" placeholder="주소를 입력하세요"/>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="zip"> 상세 주소</FieldLabel>
                                            <Input
                                                onChange={ (e) => setFormData( { ...formData, addressDetail: e.target.value } )}
                                                value={ formData.addressDetail }
                                                id="zip" type="text" placeholder=""/>
                                        </Field>
                                    </div>
                                    <div className="w-full max-w-md">
                                        <FieldLabel> 유형 </FieldLabel>
                                        <RadioGroup className="pt-3 flex">
                                            <Field orientation="horizontal">
                                                <RadioGroupItem
                                                    onClick={() => setFormData( { ...formData, type: 1 } )}
                                                    value="online" id="plan-monthly" />
                                                <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                                    온라인
                                                </FieldLabel>
                                            </Field>
                                            <Field orientation="horizontal">
                                                <RadioGroupItem
                                                    onClick={() => setFormData( { ...formData, type: 2 } )}
                                                    value="offline" id="plan-monthly" />
                                                <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                                    오프라인
                                                </FieldLabel>
                                            </Field>
                                            <Field orientation="horizontal">
                                                <RadioGroupItem
                                                    onClick={() => setFormData( { ...formData, type: 0 } )}
                                                    value="all" id="plan-monthly" />
                                                <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                                    온/오프라인
                                                </FieldLabel>
                                            </Field>
                                        </RadioGroup>
                                    </div>
                                    <Field>
                                        <FieldLabel htmlFor="feedback"> 소개 </FieldLabel>
                                        <Textarea
                                            id="feedback"
                                            placeholder="기관에 대해 설명해주세요"
                                            rows={4}
                                            onChange={ (e) => setFormData( { ...formData, description: e.target.value } )}
                                        />
                                    </Field>
                                </FieldSet>
                                <FieldSeparator />
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
                                            <Checkbox
                                                onClick={ () => setAllowDataCollecting(!allowDataCollecting) }
                                                id="terms"/>
                                            <Label htmlFor="terms"> 위 내용에 동의합니다 </Label>
                                        </div>
                                    </Field>
                                </FieldSet>
                                <Field className="justify-center" orientation="horizontal">
                                    <Button
                                        onClick={ () => validate() }
                                        className="bg-green-500" type="button"> 생성 </Button>
                                    <Button variant="outline" type="button"> 취소 </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
                <DialogContent className="w-full max-w-1/2" >
                    <DialogHeader> 사용자 조회 </DialogHeader>
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
                                    teachers.length > 0 ?
                                        teachers.map( (teacher, index) => (
                                            <TableRow key={index} className="hover:bg-white">
                                                <TableCell> { teacher.id } </TableCell>
                                                <TableCell> { teacher.name } </TableCell>
                                                <TableCell
                                                    onClick={ () => selectTeacher( teacher.id, teacher.name )}
                                                    className="hover:cursor-pointer hover:text-gray-400"> 선택 </TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        ""
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setModalOpen(false)} variant="outline" type="submit"> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default AdminOrganizationCreatePage;