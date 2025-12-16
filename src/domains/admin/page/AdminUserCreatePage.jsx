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


export const AdminUserCreatePage = () => {
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
                                <Input placeholder="이름을 입력하세요" required/>
                            </Field>
                            <Field className="flex">
                                <FieldLabel> 이메일 </FieldLabel>
                                <Input placeholder="example@gmail.com" required/>
                            </Field>
                            <Field className="flex">
                                <FieldLabel> 비밀번호 </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput type="password"/>
                                    <InputGroupAddon className="text-gray-400 hover:cursor-pointer hover:text-gray-500"
                                                     align="inline-end">
                                        표시
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription> 비밀번호는 8자리 이상이어야 합니다 </FieldDescription>
                            </Field>
                            <Field className="flex">
                                <FieldLabel> 비밀번호 확인 </FieldLabel>
                                <Input type="password" required/>
                                <FieldDescription> 비밀번호가 일치하지 않습니다 </FieldDescription>
                            </Field>
                            <Field className="flex">
                                <FieldLabel> 전화번호 </FieldLabel>
                                <Input type="number" placeholder="01000000000" required/>
                                <FieldDescription> -를 제외한 숫자만 입력해주세요 </FieldDescription>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city"> 우편 번호 </FieldLabel>
                                    <Input id="city" type="text" placeholder="우편번호를 입력하세요"/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip"> 상세 주소</FieldLabel>
                                    <Input id="zip" type="text" placeholder=""/>
                                </Field>
                            </div>
                            <div className="w-full max-w-md">
                                <FieldLabel> 역할 </FieldLabel>
                                <RadioGroup className="pt-3 flex">
                                    <Field orientation="horizontal">
                                        <RadioGroupItem value="monthly" id="plan-monthly" />
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            학생
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <RadioGroupItem value="monthly" id="plan-monthly" />
                                        <FieldLabel htmlFor="plan-monthly" className="font-normal">
                                            강사
                                        </FieldLabel>
                                    </Field>
                                </RadioGroup>
                            </div>
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
    )
}

export default AdminUserCreatePage;