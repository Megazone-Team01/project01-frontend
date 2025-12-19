import {useNavigate, useParams} from "react-router";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Field, FieldDescription, FieldSet, FieldTitle} from "@/components/ui/field.js";
import {Button} from "@/components/ui/button.js";
import {ArrowLeft} from "lucide-react";
import {useEffect, useState} from "react";
import {loadLectureWithFile} from "@/common/api/fileApi.js";


export const OnlineLecturePlayingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState({
        fileId: '',
        lectureId: '',
        originalName: '',
        url: '',
        title: '',
        teacherName: '',
        description: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadLectureWithFile( id );
            setFormData(data);
        }
        fetchData();
    }, []);

    return (
        <Card className="bg-white w-full">
            <CardHeader>
                <CardTitle> { formData.title } </CardTitle>
            </CardHeader>
            {/* src={formData.fileUrl } */ }
            <CardContent>
                <div className="flex">
                    <div className="flex-7 bg-black">
                        <video
                            src={"/testvideo.mp4"}
                            width={"100%"}
                            controls
                        />
                    </div>
                    <div className="flex-2 flex flex-col border-l-1 pl-4">
                    <FieldSet>
                        <Field>
                            <FieldTitle> 제목 </FieldTitle>
                            <FieldDescription> { formData.title } </FieldDescription>
                        </Field>
                        <Field>
                            <FieldTitle> 강사명 </FieldTitle>
                            <FieldDescription> { formData.teacherName } </FieldDescription>
                        </Field>
                        <Field>
                            <FieldTitle> 설명 </FieldTitle>
                            <FieldDescription> { formData.description} </FieldDescription>
                        </Field>
                    </FieldSet>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}>
                    <ArrowLeft /> 이전
                </Button>
            </CardFooter>
        </Card>
    )
}

export default OnlineLecturePlayingPage;