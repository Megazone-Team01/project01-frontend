import {Separator} from "@/components/ui/separator.js";
import {ScrollArea} from "@/components/ui/scroll-area.js";
import {Fragment, useEffect, useState} from "react";
import {ButtonGroup} from "@/components/ui/button-group.js";
import {Button} from "@/components/ui/button.js";
import {createCategory, getCategories} from "@/domains/admin/api/categoryApi.js";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.js";
import {Field, FieldDescription, FieldLabel, FieldSet} from "@/components/ui/field.js";
import {Input} from "@/components/ui/input.js";


export const AdminCategoryPage = () => {
    const [ first, setFirst ] = useState( [] );
    const [ second, setSecond ] = useState( [] );
    const [ third, setThird ] = useState( [] );
    const [ fourth, setFourth ] = useState( [] );
    const [ fifth, setFifth ] = useState( [] );

    const [ selected, setSelected ] = useState( 0 );
    const [ formData, setFormData ] = useState({
        parentId: null,
        parentName: '',
        name: '',
        description: '',
        code: '',
        depth: 0
    })
    const [ createOpen, setCreateOpen ] = useState( false )
    const [ updateOpen, setUpdateOpen ] = useState( false )

    useEffect( () => {
        const fetchData = async () => {
            const data = await getCategories();
            setFirst( data );
        }
        fetchData()
    }, [])

    const refreshCategory = async ( id, name, description, code, position ) => {
        const data = await getCategories( id );
        if( position === 1 ){
            setFirst( data );
            setSecond( [] );
            setThird( [] );
            setFourth( [] );
            setFifth( [] );
        }
        else if( position === 2 ){
            setSecond( data );
            setThird( [] );
            setFourth( [] );
            setFifth( [] );
        }
        else if( position === 3 ){
            setThird( data );
            setFourth( [] );
            setFifth( [] );
        }
        else if( position === 4 ){
            setFourth( data );
            setFifth( [] );
        }
        else if( position === 5 ){
            setFifth( data );
        }

        setSelected( id )
        setFormData( { ...formData, parentId: id, parentName: name, description: description, code: code, depth: position })
    }

    const setRootCategory = () => {
        setFormData( { ...formData, parentId: null, parentName: '', depth: 0 } )
        setSelected( null )
    }

    const addCategory = async () => {
        // validate
        if( formData.name.length === 0 ||
            formData.code.length === 0
        ){
            alert("빈 칸이 존재합니다")
            return
        }
        if( formData.depth === 6 ){
            alert("5차 분류에는 하위 분류를 추가할 수 없습니다" )
            return
        }
        const data = await createCategory( formData );
        if( data === 200 ) alert( "카테고리가 추가되었습니다" )
        else alert( "카테고리 추가에 실패했습니다" )
        window.location.reload()
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-center gap-3">
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 1차 분류 </h4>
                            <Separator className="my-2" />
                            {
                                first.map( (category, index) => (
                                    <Fragment
                                        key={index + "_1"}>
                                        <div
                                            className={selected === category.id ? "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold bg-gray-100" : "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold"}
                                            onClick={() => refreshCategory(category.id, category.name, category.description, category.code,2)}
                                            >
                                            <div>
                                                {category.name}
                                            </div>
                                            <div className="text-sm font-bold">
                                                { "[ " + category.code + " ]" }
                                            </div>
                                        </div>
                                    </Fragment>
                                ))
                            }
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 2차 분류 </h4>
                            <Separator className="my-2" />
                            {
                                second.map( (category, index) => (
                                    <Fragment key={index + "_2"}>
                                        <div
                                            className={selected === category.id ? "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold bg-gray-100" : "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold"}
                                            onClick={() => refreshCategory(category.id, category.name, category.description, category.code, 3)}
                                        >
                                            <div>
                                                {category.name}
                                            </div>
                                            <div className="text-sm font-bold">
                                                {"[ " + category.code + " ]"}
                                            </div>
                                        </div>
                                    </Fragment>
                                ))
                            }
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 3차 분류 </h4>
                            <Separator className="my-2"/>
                            {
                                third.map((category, index) => (
                                    <Fragment key={index + "_3"}>
                                        <div
                                            className={selected === category.id ? "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold bg-gray-100" : "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold"}
                                            onClick={() => refreshCategory(category.id, category.name, category.description, category.code, 4)}
                                        >
                                            <div>
                                                {category.name}
                                            </div>
                                            <div className="text-sm font-bold">
                                                {"[ " + category.code + " ]"}
                                            </div>
                                        </div>
                                    </Fragment>
                                ))
                            }
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 4차 분류 </h4>
                            <Separator className="my-2"/>
                            {
                                fourth.map((category, index) => (
                                    <Fragment key={index + "_4"}>
                                        <div
                                            className={selected === category.id ? "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold bg-gray-100" : "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold"}
                                            onClick={() => refreshCategory(category.id, category.name, category.description, category.code, 5)}
                                        >
                                            <div>
                                                {category.name}
                                            </div>
                                            <div className="text-sm font-bold">
                                                {"[ " + category.code + " ]"}
                                            </div>
                                        </div>
                                    </Fragment>
                                ))
                            }
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 5차 분류 </h4>
                            <Separator className="my-2"/>
                            {
                                fifth.map((category, index) => (
                                    <Fragment key={index + "_5"}>
                                        <div
                                            className={selected === category.id ? "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold bg-gray-100" : "flex gap-1 justify-center text-sm pb-2 hover:cursor-pointer hover:font-bold"}
                                            onClick={() => refreshCategory(category.id, category.name, category.description, category.code, 6)}
                                        >
                                            <div>
                                                {category.name}
                                            </div>
                                            <div className="text-sm font-bold">
                                                {"[ " + category.code + " ]"}
                                            </div>
                                        </div>
                                    </Fragment>
                                ))
                            }
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <Dialog open={createOpen} onClose={setCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle> 카테고리 추가 </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col w-full">
                        <FieldSet>
                            <Field>
                                <FieldLabel> 선택된 상위 카테고리 </FieldLabel>
                                <Input type="text" value={formData.parentName === '' ? "최상위" : formData.parentName}
                                       disabled/>
                                <FieldDescription
                                    onClick={() => setRootCategory()}
                                    className="text-gray-400 text-sm hover:cursor-pointer hover:text-black"
                                > 최상위에 추가하기 </FieldDescription>
                            </Field>
                            <Field>
                            <FieldLabel> 이름 </FieldLabel>
                                <Input
                                    onChange={ (e) => setFormData( { ...formData, name: e.target.value } )}
                                    type="text" />
                            </Field>
                            <Field>
                                <FieldLabel> 코드 </FieldLabel>
                                <Input
                                    onChange={ (e) => setFormData( { ...formData, code: e.target.value } ) }
                                    type="text" />
                            </Field>
                            <Field>
                                <FieldLabel> 설명 </FieldLabel>
                                <Input
                                    onChange={ (e) => setFormData( { ...formData, description: e.target.value } ) }
                                    type="text" />
                            </Field>
                        </FieldSet>
                    </div>
                    <DialogFooter>
                         <Button className="bg-green-500" variant="outline" onClick={() => addCategory() }> 추가 </Button>
                        <Button variant="outline" onClick={() => setCreateOpen(false) }> 닫기 </Button>
                    </DialogFooter>
                </DialogContent>
            <Dialog open={updateOpen} onClose={setUpdateOpen}>
                <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle> 카테고리 수정 </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col w-full">
                    <FieldSet>
                        <Field>
                            <FieldLabel> 이름 </FieldLabel>
                            <Input
                                onChange={ (e) => setFormData( { ...formData, name: e.target.value } )}
                                value={formData.parentName}
                                type="text" />
                        </Field>
                        <Field>
                            <FieldLabel> 코드 </FieldLabel>
                            <Input
                                onChange={ (e) => setFormData( { ...formData, code: e.target.value } ) }
                                value={formData.code}
                                type="text" disabled/>
                        </Field>
                        <Field>
                            <FieldLabel> 설명 </FieldLabel>
                            <Input
                                onChange={ (e) => setFormData( { ...formData, description: e.target.value } ) }
                                value={formData.description}
                                type="text" />
                        </Field>
                    </FieldSet>
                </div>
                <DialogFooter>
                    <Button className="bg-green-500" variant="outline"> 추가 </Button>
                    <Button variant="outline" onClick={() => setUpdateOpen(false) }> 닫기 </Button>
                </DialogFooter>
            </DialogContent>
                <div className="flex justify-end gap-1">
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setCreateOpen(true)}
                            className="bg-green-500 text-white" variant="default"> 추가 </Button>
                    </DialogTrigger>
                    <DialogTrigger>
                        <Button
                            onClick={ () => setUpdateOpen(true)}
                            className="bg-gray-500 text-white" variant="default"> 수정 </Button>
                    </DialogTrigger>
                    <Button className="bg-red-500 text-white" variant="default"> 삭제 </Button>
                </div>
            </Dialog>
            </Dialog>
        </div>
    )

}

export default AdminCategoryPage;