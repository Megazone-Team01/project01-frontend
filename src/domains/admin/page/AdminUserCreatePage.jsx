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
        addressCode: '',
        addressDetail: '',
        role: '',
        type: ''
    });
    const [ pwMatching, setPwMatching ] = useState(false);
    const [ allowDataCollecting, setAllowDataCollecting ] = useState(false);

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

    const validate = async () => {
        // 개인 정보 동의 확인
        if( !allowDataCollecting ) return alert("개인 정보 동의는 필수입니다")
        // 빈 값이 있는지 확인
        if(
            formData.name.length === 0 ||
            formData.email.length === 0 ||
            formData.password.length === 0 ||
            formData.phone.length === 0 ||
            formData.addressCode.length === 0 ||
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
        if( !/^\d+$/.test( formData.addressCode ) ) {
            alert("우편번호는 숫자만 포함되어야 합니다")
            return
        }
        if( formData.addressCode.length !== 5 ) {
            alert("우편번호가 올바르지 않습니다")
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
                                        type="password"/>
                                    <InputGroupAddon className="text-gray-400 hover:cursor-pointer hover:text-gray-500"
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
                                    <FieldLabel htmlFor="city"> 우편 번호 </FieldLabel>
                                    <Input
                                        onChange={(e) => setFormData({...formData, addressCode: e.target.value})}
                                        value={formData.addressCode}
                                        id="city" type="text" placeholder="우편번호를 입력하세요"/>
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