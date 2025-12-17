import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {ScrollArea} from "@/components/ui/scroll-area.js";
import {Fragment} from "react";
import {Separator} from "@/components/ui/separator.js";


export const AdminTodoBoard = ( { data, name } ) => {
    return (
        <Card className="w-full bg-white hover:cursor-pointer hover:bg-gray-50">
            <CardHeader>
                <CardTitle className="text-center"> { name } </CardTitle>
                <Separator className="my-1" />
            </CardHeader>
            <CardContent className="" >
                <ScrollArea>
                    <Fragment>
                        <div className="flex">
                            <p className="text-sm flex-1"> 1 </p>
                            <p className="text-sm flex-5"> 뭐든지 이름 </p>
                            <p className="text-sm flex-3"> 2025.12.19 </p>
                        </div>
                    </Fragment>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default AdminTodoBoard;