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
import {getOrganizations, deleteOrganization} from "@/domains/admin/api/organizationApi.js";
import {Empty, EmptyMedia, EmptyTitle} from "@/components/ui/empty.js";


export const AdminOrganizationList = () => {
    const [ organizations, setOrganizations ] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            const data = await getOrganizations();
            setOrganizations(data);
        }
        fetchData();
    }, [])

    return (
        <Card className="w-full min-h-80 bg-white">
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
        </Card>
    )

}