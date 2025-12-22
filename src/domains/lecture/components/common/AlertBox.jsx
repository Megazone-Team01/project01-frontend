import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {lectureStatus} from "@/lib/utils.js";
import useLectureRegister from "@/domains/lecture/hook/useLectureRegister.js";
import useLectureCancel from "@/domains/lecture/hook/useLectureCancel.js";

export function AlertBox({ text, startAt, endAt, lectureType, lectureId}) {
    const register = useLectureRegister();
    const cancel = useLectureCancel();
    const isApply = text === "강의 신청";

    const handleRegister = () =>{
        register.mutate({
            lectureType: lectureType,
            lectureId: lectureId
        });
    }
    const handleCancel = () => {
        cancel.mutate({
            lectureType: lectureType,
            lectureId: lectureId
        })
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {isApply ?  <Button
                        className={`
                    w-full
                    ${lectureStatus(startAt, endAt) === "강의 종료"||
                        lectureStatus(startAt, endAt) === "강의중"
                            ? "pointer-events-none opacity-50" : ""}
                     p-2 border-1 border-black `}
                        variant="outline">{text}
                    </Button>
                    :
                    lectureStatus(startAt, endAt) === "모집중" ?
                        <Button
                            className={`
                        w-full
                        bg-red-600 text-white
                        hover:bg-red-600 hover:text-white
                        hover:opacity-90
                        transition-none
                      `}
                        >
                            {text}
                        </Button> : null
                }

            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    {isApply ? <AlertDialogTitle>수강 신청하시겠습니까?</AlertDialogTitle>
                        : <AlertDialogTitle>수강 취소하시겠습니까?</AlertDialogTitle>}
                    <AlertDialogDescription/>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    {isApply ?
                        <AlertDialogAction onClick={handleRegister}>신청</AlertDialogAction>
                        : <AlertDialogAction onClick={handleCancel}>강의 취소</AlertDialogAction>}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}