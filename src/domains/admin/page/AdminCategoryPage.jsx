import {Separator} from "@/components/ui/separator.js";
import {ScrollArea} from "@/components/ui/scroll-area.js";
import {Fragment, useState} from "react";
import {ButtonGroup} from "@/components/ui/button-group.js";
import {Button} from "@/components/ui/button.js";


export const AdminCategoryPage = () => {
    const [ first, setFirst ] = useState( [] );
    const [ second, setSecond ] = useState( [] );
    const [ third, setThird ] = useState( [] );
    const [ fourth, setFourth ] = useState( [] );
    const [ fifth, setFifth ] = useState( [] );
    return (
        <div className="flex flex-col">
            <div className="flex justify-center gap-3">
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 1차 분류 </h4>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 2차 분류 </h4>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 3차 분류 </h4>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 4차 분류 </h4>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                        </div>
                    </ScrollArea>
                </div>
                <Separator orientation="vertical"/>
                <div className="flex text-center flex-col flex-1">
                    <ScrollArea className="w-full h-[70vh] flex flex-col">
                        <div className="p-4">
                            <h4 className="mb-4 text-sm leading-none font-medium"> 5차 분류 </h4>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                            <Fragment key={1}>
                                <div className="text-sm pb-2">{1}</div>
                            </Fragment>
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <div className="flex justify-end">
                <ButtonGroup>
                    <Button className="bg-green-500 text-white" variant="default"> 추가 </Button>
                    <Button className="bg-gray-500 text-white" variant="default"> 변경 </Button>
                    <Button className="bg-red-500 text-white" variant="default"> 삭제 </Button>
                </ButtonGroup>
            </div>
        </div>
    )

}

export default AdminCategoryPage;