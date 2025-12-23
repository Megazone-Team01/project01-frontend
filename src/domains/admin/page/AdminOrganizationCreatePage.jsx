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
                                                <div className="text-xs text-start">
                                                    <pre className="whitespace-pre">
                                                {
                                                    `
개인정보 처리방침

시행일자: 2025년 1월 1일
1. 수집하는 개인정보 항목
1.1 사용자 회원가입

필수항목: 이메일 주소, 비밀번호, 이름, 전화번호
선택항목: 프로필 사진, 생년월일
자동수집: 접속 IP 정보, 쿠키, 서비스 이용기록

1.2 기업 생성

필수항목: 기업명, 사업자등록번호, 대표자명, 사업장 주소, 대표 전화번호
선택항목: 기업 로고, 업종, 기업 소개

1.3 강의 생성

필수항목: 강사명, 강사 이메일, 강사 연락처
선택항목: 강사 경력사항, 자격증 정보

2. 개인정보의 수집 및 이용목적
2.1 회원가입 및 관리

회원 식별 및 본인확인
서비스 부정이용 방지
각종 고지사항 전달
분쟁 조정을 위한 기록 보존

2.2 기업 서비스 제공

기업 계정 생성 및 관리
기업 정보 검증
강의 플랫폼 서비스 제공
정산 및 세금계산서 발행

2.3 강의 서비스 제공

강의 개설 및 운영
수강생과의 매칭
강의 품질 관리
강사 정보 제공

3. 개인정보의 보유 및 이용기간

회원정보: 회원 탈퇴 시까지 (단, 관계 법령 위반 시 최대 5년)
기업정보: 계약 종료 후 5년 (전자상거래법 준수)
강의정보: 강의 종료 후 3년
결제정보: 거래 완료 후 5년 (전자금융거래법 준수)

4. 개인정보의 제3자 제공
원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우 예외로 합니다:

이용자가 사전에 동의한 경우
법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우

6. 이용자의 권리
이용자는 언제든지 다음의 권리를 행사할 수 있습니다:

개인정보 열람 요구
개인정보 정정·삭제 요구
개인정보 처리정지 요구
회원 탈퇴 (동의 철회)

권리 행사 방법: 고객센터 또는 개인정보 보호책임자에게 서면, 전화, 이메일로 연락
7. 개인정보의 파기
개인정보 보유기간이 경과하거나 처리목적이 달성된 경우, 지체 없이 파기합니다:

전자파일: 복구 불가능한 방법으로 영구 삭제
종이문서: 분쇄 또는 소각

8. 개인정보 보호책임자
개인정보 보호책임자

성명: 홍길동
직책: 개인정보보호팀장
연락처: privacy@example.com / 02-1234-5678

개인정보 보호담당자

성명: 김철수
부서: 고객지원팀
연락처: support@example.com / 02-1234-5679

9. 쿠키의 운영
서비스는 이용자에게 최적화된 서비스를 제공하기 위해 쿠키를 사용합니다:

쿠키 사용목적: 로그인 세션 유지, 이용자 맞춤 서비스 제공
쿠키 거부 방법: 브라우저 설정에서 쿠키 저장 거부 가능 (단, 일부 서비스 이용 제한 가능)

10. 개인정보 처리방침 변경
본 방침은 2025년 1월 1일부터 시행됩니다. 개인정보 처리방침 변경 시 웹사이트 공지사항을 통해 공지합니다.
                                                    `
                                                }
                                            </pre>
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