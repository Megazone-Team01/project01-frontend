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
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "@/components/ui/dialog.js";
import {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {Separator} from "@/components/ui/separator.js";
import {ScrollArea} from "@/components/ui/scroll-area.js";


export const AdminLectureCreatePage = () => {
    const [ userOpen, setUserOpen ] = useState(false);
    const [ organizationOpen, setOrganizationOpen ] = useState(false);
    const [ categoryOpen, setCategoryOpen ] = useState(false);

    return (
        <div>
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
                                        <Input placeholder="이름을 입력하세요" required/>
                                    </Field>
                                    <Field className="flex">
                                        <FieldLabel> 기관 </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput placeholder="기관을 선택해주세요" disabled />
                                            <InputGroupAddon align="inline-end">
                                                <DialogTrigger>
                                                    <InputGroupButton onClick={() => setOrganizationOpen(true)} className="hover:cursor-pointer" variant="ghost">
                                                        <MoreHorizontal />
                                                    </InputGroupButton>
                                                </DialogTrigger>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field className="flex">
                                        <FieldLabel> 대표자 </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput placeholder="대표자를 선택해주세요" disabled />
                                            <InputGroupAddon align="inline-end">
                                                <DialogTrigger>
                                                    <InputGroupButton onClick={() => setUserOpen(true)} className="hover:cursor-pointer" variant="ghost">
                                                        <MoreHorizontal />
                                                    </InputGroupButton>
                                                </DialogTrigger>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field className="flex">
                                        <FieldLabel> 전화번호 </FieldLabel>
                                        <Input type="text" placeholder="01000000000" required/>
                                        <FieldDescription> -를 제외한 숫자만 입력해주세요 </FieldDescription>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <FieldLabel> 카테고리 </FieldLabel>
                                        <FieldDescription> 1 - 2 - 3</FieldDescription>
                                        <Button onClick={() => setCategoryOpen(true)} type="button" className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" variant="outline"> 카테고리 지정 </Button>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="feedback"> 소개 </FieldLabel>
                                        <Textarea
                                            id="feedback"
                                            placeholder="기관에 대해 설명해주세요"
                                            rows={4}
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
                    <Separator />
                    <div className="flex flex-col w-full">
                        <div className="flex gap-1">
                            <InputGroup>
                                <InputGroupInput />
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
                                        <p className="text-sm"> 가 </p>
                                        <p className="text-sm"> 가 </p>
                                        <p className="text-sm"> 가 </p>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-100">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">

                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-200">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">

                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-300">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">

                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card className="flex-1 py-3 my-2 bg-gray-400">
                                <CardContent>
                                    <ScrollArea className="h-48 w-full">

                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setCategoryOpen(false)} variant="outline" type="submit"> 취소 </Button>
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] text-center"> ID </TableHead>
                                    <TableHead className="w-[200px] text-center"> 기관명 </TableHead>
                                    <TableHead className="text-center"> 대표자명 </TableHead>
                                    <TableHead className="w-[80px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="hover:bg-white">
                                    <TableCell> 1 </TableCell>
                                    <TableCell> 1 </TableCell>
                                    <TableCell> 1 </TableCell>
                                    <TableCell className="hover:cursor-pointer hover:text-gray-400"> 선택 </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setOrganizationOpen(false)} variant="outline" type="submit"> 취소 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                                    <TableHead className="text-center"> 소속 </TableHead>
                                    <TableHead className="w-[80px] text-center"> 작업 </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="hover:bg-white">
                                    <TableCell> 1 </TableCell>
                                    <TableCell> 1 </TableCell>
                                    <TableCell> 1 </TableCell>
                                    <TableCell className="hover:cursor-pointer hover:text-gray-400"> 선택 </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-50 hover:text-gray-500 hover:cursor-pointer" onClick={() => setUserOpen(false)} variant="outline" type="submit"> 취소 </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default AdminLectureCreatePage;