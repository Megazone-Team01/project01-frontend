import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.js";
import {ButtonGroup} from "@/components/ui/button-group.js";
import {Button} from "@/components/ui/button.js";
import {useEffect, useState} from "react";
import {createDay, getDays} from "@/domains/admin/api/dayApi.js";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.js";
import {Field, FieldLabel, FieldSet} from "@/components/ui/field.js";
import {Input} from "@/components/ui/input.js";


export const AdminDayPage = () => {
    const [ days, setDays] = useState([]);
    const [ formData, setFormData ] = useState({
        name: '',
        value: 0
    })

    const [ createOpen, setCreateOpen ] = useState( false )

    const [ selected, setSelected ] = useState( null );

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDays();
            setDays( data );
        }
        fetchData();
    }, []);

    const submitForm = async () => {
        // validate
        if( formData.name.length === 0 || formData.value < 1 ){
            alert( "모든 값을 입력해주세요" )
            return
        }
        const data = await createDay( formData.name, formData.value )
        if( data === 200 ) {
            alert( "요일 추가가 완료되었습니다" )
            window.location.reload()
        }
        else alert( "요일 추가에 실패했습니다" )
    }

    const selectRow = ( name, value ) => {
        setSelected( value );
        setFormData( { ...formData, name: name, value: value } )
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold"> 요일 태그 관리 </h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center"> 요일 </TableHead>
                        <TableHead className="text-center"> 요일값 </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                    {
                        Object.entries(days).map(([key, value]) => (
                            <TableRow
                                onClick={() => selectRow( key, value )}
                                key={key}
                                className={ selected === value ? "hover:bg-gray-300 bg-gray-200 hover:cursor-pointer" : "hover:bg-white hover:cursor-pointer"}
                            >
                                <TableCell>{key}</TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Dialog open={createOpen} onClose={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle> 요일 추가 </DialogTitle>
                    </DialogHeader>
                    <div>
                        <FieldSet>
                            <Field>
                                <FieldLabel> 요일명 </FieldLabel>
                                <Input
                                    onChange={ (e) => setFormData( { ...formData, name: e.target.value})}
                                    value={formData.name}
                                    type="text" />
                            </Field>
                            <Field>
                                <FieldLabel> 요일값 </FieldLabel>
                                <Input
                                    onChange={ (e) => setFormData( { ...formData, value: e.target.value})}
                                    value={formData.value}
                                    type="number"
                                    min="1"
                                />
                            </Field>
                        </FieldSet>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => submitForm()} className="bg-blue-500 text-white" variant="outline"> 추가 </Button>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
                <div className="flex w-full justify-end pt-3">
                    <ButtonGroup>
                        <Button
                            onClick={() => setCreateOpen(true)}
                            className="bg-green-500 text-white" variant="default"> 추가 </Button>
                        <Button className="bg-red-500 text-white" variant="default"> 삭제 </Button>
                    </ButtonGroup>
                </div>
            </Dialog>
        </div>
    )
}

export default AdminDayPage;