import {useParams} from "react-router";

function OnlineDetail() {
    // useParams()로 URL 변수 받기
    const { onlineId } = useParams();

    return (
        <div>
            <h2>온라인 강의 상세</h2>
            <p>강의 ID: {onlineId}</p>
        </div>
    );
}

export default OnlineDetail;