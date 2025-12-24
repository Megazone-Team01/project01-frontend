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
import {useSelector} from "react-redux";
import {useNavigate} from "react-router";

export function AlertBox({ text, startAt, endAt, lectureType, lectureId}) {
    const register = useLectureRegister();
    const cancel = useLectureCancel();
    const isApply = text === "강의 신청";

    const { isAuthenticated } = useSelector((state) => state.auth ?? {});
    const navigate = useNavigate()

    const handleRegister = () => {
        if( !isAuthenticated ){
            alert("로그인이 필요한 작업입니다")
            navigate( "/login")
            return
        }
        register.mutate({
            lectureType: lectureType,
            lectureId: lectureId
        }, {
            onSuccess: () => {
                window.location.reload(); // 새로고침
            }
        });
    }
    const handleCancel = () => {
        if( !isAuthenticated ){
            alert("로그인이 필요한 작업입니다")
            navigate( "/login")
            return
        }
        cancel.mutate({
            lectureType: lectureType,
            lectureId: lectureId
        }, {
            onSuccess: () => {
                window.location.reload(); // 새로고침
            }
        });
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {isApply ?  <Button
                        className={`
                    w-full
                    ${lectureStatus(startAt, endAt) === "강의 종료"
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