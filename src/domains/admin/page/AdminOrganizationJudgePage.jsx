import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.js";
import {Button} from "@/components/ui/button.js";
import {Empty, EmptyTitle} from "@/components/ui/empty.js";
import {Separator} from "@/components/ui/separator.js";


export const AdminOrganizationJudgePage = () => {
    const [ organizations, setOrganizations ] = useState( [] );

    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle className="text-center"> 승인 대기 </CardTitle>
                <Separator className="my-2" />
            </CardHeader>
            <CardContent>
                {
                    organizations.length === 0 ?
                        <Empty>
                            <EmptyTitle> 대기 중인 기관이 없습니다</EmptyTitle>
                        </Empty>
                        :
                        <div className="grid grid-cols-3 gap-2">
                            <Item variant="outline">
                                <ItemContent>
                                    <ItemTitle> Megazone Academy </ItemTitle>
                                    <ItemDescription> Desfad </ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Button className="bg-green-500" variant="default"> 승인 </Button>
                                    <Button variant="destructive"> 거절 </Button>
                                </ItemActions>
                            </Item>
                        </div>
                }
            </CardContent>
        </Card>
    )

}

export default AdminOrganizationJudgePage;