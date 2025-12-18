import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.js";
import {Button} from "@/components/ui/button.js";
import {Empty, EmptyTitle} from "@/components/ui/empty.js";
import {Separator} from "@/components/ui/separator.js";
import {approveLecture, getJudgedLectures, rejectLecture} from "@/domains/admin/api/lectureApi.js";


export const AdminLectureJudgePage = () => {
    const [ lectures, setLectures ] = useState( [] );

    useEffect(() => {
        const fetchData = async () => {
            const data= await getJudgedLectures();
            setLectures( data )
        }
        fetchData();
    }, []);

    const approve = async ( id ) => {
        const data = await approveLecture( id );
        if( data === 200 ) alert( "강의가 승인되었습니다" )
         else alert( "강의 승인에 실패했습니다" )

        window.location.reload()
    }
    const reject = async ( id ) => {
        const data = await rejectLecture( id );
        if( data === 200 ) alert( "강의가 반려되었습니다" )
        else alert( "강의 반려에 실패했습니다" )

        window.location.reload()
    }

    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle className="text-center"> 승인 대기 </CardTitle>
                <Separator className="my-2" />
            </CardHeader>
            <CardContent>
                {
                    lectures.length === 0 ?
                        <Empty>
                            <EmptyTitle> 대기 중인 강의가 없습니다</EmptyTitle>
                        </Empty>
                        :
                        <div className="grid grid-cols-3 gap-2">
                            {
                                lectures.map( ( lecture, index ) => (
                                        <Item key={index} variant="outline">
                                            <ItemContent>
                                                <ItemTitle className="font-bold"> { lecture.name } </ItemTitle>
                                                <ItemDescription> { lecture.teacherName } </ItemDescription>
                                                <ItemDescription
                                                    className="text-gray-400"
                                                > { lecture.organizationName } </ItemDescription>
                                            </ItemContent>
                                            <ItemActions>
                                                <Button
                                                    onClick={() => approve( lecture.id )}
                                                    className="bg-green-500" variant="default"> 승인 </Button>
                                                <Button
                                                    onClick={ () => reject( lecture.id )}
                                                    variant="destructive"> 거절 </Button>
                                            </ItemActions>
                                        </Item>
                                ))
                            }
                        </div>
                }
            </CardContent>
        </Card>
    )

}

export default AdminLectureJudgePage;