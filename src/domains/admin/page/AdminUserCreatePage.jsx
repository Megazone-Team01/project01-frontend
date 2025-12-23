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
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.js";
import {RadioGroup} from "@radix-ui/react-radio-group";
import {RadioGroupItem} from "@/components/ui/radio-group.js";
import {Checkbox} from "@/components/ui/checkbox.js";
import {Label} from "@/components/ui/label.js";
import {Button} from "@/components/ui/button.js";
import {useState} from "react";
import {createUser} from "@/domains/admin/api/userApi.js";


export const AdminUserCreatePage = () => {
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        addressDetail: '',
        role: '',
        type: ''
    });
    const [ pwMatching, setPwMatching ] = useState(false);
    const [ allowDataCollecting, setAllowDataCollecting ] = useState(false);
    const [ showPassword, setShowPassword] = useState(false);

    console.log( formData )

    const checkPassword = ( value ) => {
        if( formData.password !== value || formData.password.length === 0 ) setPwMatching(false);
        else setPwMatching(true)
    }

    const checkPasswordConfirm = ( value ) => {
        if( formData.password !== value || formData.password.length === 0 ) setPwMatching(false);
        else setPwMatching(true)

        setFormData( { ...formData, password: value } );
    }

    const displayPassword = () => {
        setShowPassword(!showPassword);
    }

    const validate = async () => {
        // 개인 정보 동의 확인
        if( !allowDataCollecting ) return alert("개인 정보 동의는 필수입니다")
        // 빈 값이 있는지 확인
        if(
            formData.name.length === 0 ||
            formData.email.length === 0 ||
            formData.password.length === 0 ||
            formData.phone.length === 0 ||
            formData.address.length === 0 ||
            formData.role.length === 0 ||
            formData.type.length === 0
        ) {
            alert( "빈 칸이 존재합니다" )
            return
        }

        // 형식 확인
        if( !formData.email.includes("@")) {
            alert( "이메일 형식이 올바르지 않습니다" )
            return;
        }
        if( !pwMatching ) {
            alert("비밀번호가 일치하기 않습니다")
            return
        }
        if( formData.password.length < 8 ) {
            alert( "이메일은 8자리 이상이어야 합니다" )
            return
        }
        if( !/^\d+$/.test( formData.phone ) ) {
            alert("전화번호는 숫자만 포함되어야 합니다")
            return
        }
        if( formData.phone.length !== 11 ) {
            alert("전화번호가 올바르지 않습니다")
            return
        }

        await sendData();
    }

    const sendData = async () => {
        const data = await createUser( formData );

        if( data.id > 0 ) {
            alert( "사용자 추가가 완료되었습니다" )
            window.location.reload();
        }
        else alert("사용자 생성에 실패했습니다")
    }

    return (
        <Card className="bg-white">
            <CardContent>
                <form>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend> 사용자 추가 </FieldLegend>
                            <FieldDescription> 새로운 사용자를 추가합니다 </FieldDescription>
                            <Field className="flex">
                                <FieldLabel> 이름 </FieldLabel>
                                <Input onChange={(e) => setFormData({...formData, name: e.target.value})}
                                       value={formData.name} placeholder="이름을 입력하세요" required/>
                            </Field>
                            <Field className="flex">
                                <FieldLabel> 이메일 </FieldLabel>
                                <Input onChange={(e) => setFormData({...formData, email: e.target.value})}
                                       value={formData.email} placeholder="example@gmail.com" required/>
                            </Field>
                            <Field className="flex">
                                <FieldLabel> 비밀번호 </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        onChange={(e) => checkPasswordConfirm(e.target.value)} value={formData.password}
                                        type={ showPassword ? "text" : "password" }/>
                                    <InputGroupAddon
                                        onClick={ () => displayPassword() }
                                        className="text-gray-400 hover:cursor-pointer hover:text-gray-500"
                                        align="inline-end">
                                        표시
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription> 비밀번호는 8자리 이상이어야 합니다 </FieldDescription>
                            </Field>
                            <Field className="flex">
                                <FieldLabel> 비밀번호 확인 </FieldLabel>
                                <Input onChange={(e) => checkPassword(e.target.value)} type="password" required/>
                                {
                                    !pwMatching ?
                                        <FieldDescription className="text-red-500"> 비밀번호가 일치하지 않습니다 </FieldDescription>
                                        : <FieldDescription className="text-green-500"> 비밀번호가 일치합니다 </FieldDescription>
                                }

                            </Field>
                            <Field className="flex">
                                <FieldLabel> 전화번호 </FieldLabel>
                                <Input
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    value={formData.phone}
                                    type="number" placeholder="01000000000" required/>
                                <FieldDescription> -를 제외한 숫자만 입력해주세요 </FieldDescription>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city"> 도로명 주소 </FieldLabel>
                                    <Input
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        value={formData.address}
                                        id="city" type="text" placeholder="도로명을 입력하세요"/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip"> 상세 주소</FieldLabel>
                                    <Input
                                        onChange={(e) => setFormData({...formData, addressDetail: e.target.value})}
                                        value={formData.addressDetail}
                                        id="zip" type="text" placeholder=""/>
                                </Field>
                            </div>
                            <div className="w-full max-w-md">
                                <FieldLabel> 역할 </FieldLabel>
                                <RadioGroup
                                    className="pt-3 flex">
                                    <Field orientation="horizontal">
                                        <RadioGroupItem value="student" id="student"
                                                        onClick={() => setFormData({...formData, role: "STUDENT"})}
                                        />
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            학생
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <RadioGroupItem
                                            onClick={() => setFormData({...formData, role: "TEACHER"})}
                                            value="teacher" id="teacher"/>
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            강사
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <RadioGroupItem
                                            onClick={() => setFormData({...formData, role: "ADMIN"})}
                                            value="admin" id="admin"/>
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            관리자
                                        </FieldLabel>
                                    </Field>
                                </RadioGroup>
                            </div>
                            <div className="w-full max-w-md">
                                <FieldLabel> 유형 </FieldLabel>
                                <RadioGroup
                                    className="pt-3 flex">
                                    <Field orientation="horizontal">
                                        <RadioGroupItem value="onoff" id="onoff"
                                                        onClick={() => setFormData({...formData, type: "ALL" })}
                                        />
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            온라인 + 오프라인
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <RadioGroupItem
                                            onClick={() => setFormData({...formData, type: "ONLINE" })}
                                            value="online" id="online"/>
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            온라인
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <RadioGroupItem
                                            onClick={() => setFormData({...formData, type: "OFFLINE" })}
                                            value="offline" id="offline"/>
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            오프라인
                                        </FieldLabel>
                                    </Field>
                                </RadioGroup>
                            </div>
                        </FieldSet>
                        <FieldSeparator/>
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
                                    <Checkbox id="terms"
                                              onClick={() => setAllowDataCollecting(!allowDataCollecting)}
                                    />
                                    <Label htmlFor="terms"> 위 내용에 동의합니다 </Label>
                                </div>
                            </Field>
                        </FieldSet>
                        <Field className="justify-center" orientation="horizontal">
                            <Button onClick={() => validate()} className="bg-green-500 hover:bg-green-300"
                                    type="button"> 생성 </Button>
                            <Button variant="outline" type="button"> 취소 </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default AdminUserCreatePage;