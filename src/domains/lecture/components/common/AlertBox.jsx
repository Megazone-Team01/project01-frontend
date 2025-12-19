import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {lectureStatus} from "@/lib/utils.js";
import useLectureRegister from "@/domains/lecture/hook/useLectureRegister.js";

export function AlertBox({text,startAt,endAt, lectureType, offlineId}) {
    const register = useLectureRegister();

    const handleRegister = () =>{
        register.mutate({
            lectureType: lectureType,
            lectureId: offlineId
        });
    }



    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className={`${lectureStatus(startAt, endAt) === "강의 종료"||
                    lectureStatus(startAt, endAt) === "수강중"
                    ? "pointer-events-none opacity-50" : ""}
                     p-2 border-1 border-black `}
                    variant="outline">{text}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>수강 신청하시겠습니까?</AlertDialogTitle>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRegister}>신청</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}