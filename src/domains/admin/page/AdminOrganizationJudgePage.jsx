import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.js";
import {Button} from "@/components/ui/button.js";
import {Empty, EmptyTitle} from "@/components/ui/empty.js";
import {Separator} from "@/components/ui/separator.js";
import {approveOrganization, getWaitingOrganizations, rejectOrganization} from "@/domains/admin/api/organizationApi.js";


export const AdminOrganizationJudgePage = () => {
    const [ organizations, setOrganizations ] = useState( [] );

    useEffect(() => {
        const fetchData = async () => {
            const data = await getWaitingOrganizations();
            setOrganizations( data );
        }
        fetchData();
    }, []);

    const approve = async ( id ) => {
        const result = await approveOrganization( id );
        if( result === 200 ) alert("승인되었습니다");
        else alert("서버 문제가 발생했습니다")
    }

    const reject = async ( id ) => {
        const result = await rejectOrganization( id );
        if( result === 200 ) alert("반려되었습니다");
        else alert("서버 문제가 발생했습니다")
    }

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
                        <div>
                            {
                                organizations.map( (org, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-2">
                                        <Item className="m-1" variant="outline">
                                            <ItemContent>
                                                <ItemTitle> { org.name } </ItemTitle>
                                                <ItemDescription> { org.ownerName} </ItemDescription>
                                                <ItemDescription> { org.isOnline} </ItemDescription>
                                            </ItemContent>
                                            <ItemActions>
                                                <Button
                                                    onClick={ () => approve( org.id ) }
                                                    className="bg-green-500 hover:bg-green-300 hover:cursor-pointer" variant="default"> 승인 </Button>
                                                <Button
                                                    onClick={ () => reject( org.id ) }
                                                    variant="destructive"> 거절 </Button>
                                            </ItemActions>
                                        </Item>
                                    </div>
                                ))
                            }
                        </div>
                }
            </CardContent>
        </Card>
    )

}

export default AdminOrganizationJudgePage;