import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {ScrollArea} from "@/components/ui/scroll-area.js";
import {Fragment} from "react";
import {Separator} from "@/components/ui/separator.js";
import {Empty, EmptyTitle} from "@/components/ui/empty.js";


export const AdminTodoBoard = ( { data, name } ) => {

    console.log( data, name)

    return (
        <Card className="w-full bg-white hover:cursor-pointer hover:bg-gray-50">
            <CardHeader>
                <CardTitle className="text-center"> { name } </CardTitle>
                <Separator className="my-1" />
            </CardHeader>
            <CardContent className="" >
                <ScrollArea>
                    <Fragment>
                        {
                            data.length === 0 ?
                                <Empty>
                                    <EmptyTitle> 내용이 없습니다 </EmptyTitle>
                                </Empty>
                                :
                            data.map( ( d, index ) => (
                                <div key={index + "_" + name } className="flex">
                                    <p className="text-sm flex-1"> { d.id } </p>
                                    <p className="text-sm flex-5"> { d.name } </p>
                                    <p className="text-sm flex-3"> { d.createdAt.substring(0, 19) } </p>
                                </div>
                            ))
                        }
                    </Fragment>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default AdminTodoBoard;