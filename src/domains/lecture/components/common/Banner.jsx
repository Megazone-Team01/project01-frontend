import {useLocation} from "react-router";

function Banner(){
    const location = useLocation();
    const type = location.pathname.includes("/online") ? "online" : "offline";
    return (
        <div className="flex justify-center items-center mx-auto mb-20 bg-neutral-600 h-60 rounded-2xl">
            <h1 className="font-medium  text-3xl text-white">
                <div className="flex flex-col justify-center items-center gap-2">
                    <span>LinkEd</span>
                    <span>교육 {type === "online" ? "온라인" : "오프라인"} 프로그램</span>
                </div>
            </h1>
        </div>
    )
}

export default Banner;