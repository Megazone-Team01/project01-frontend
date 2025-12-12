import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {ScrollArea} from "@/components/ui/scroll-area.js";
import {Fragment} from "react";
import {Separator} from "@/components/ui/separator.js";


export const AdminTodoBoard = () => {
    return (
        <Card className="w-full bg-white">
            <CardHeader>
                <CardTitle className="text-center"> 승인 대기 </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea>
                    <Fragment>
                        <span className="text-sm"> df </span>
                        <Separator className="my-1" />
                    </Fragment>
                    <Fragment>
                        <span className="text-sm"> df </span>
                        <Separator className="my-1" />
                    </Fragment>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default AdminTodoBoard;