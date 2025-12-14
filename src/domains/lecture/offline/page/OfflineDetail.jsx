import {useParams} from "react-router";

function OfflineDetail() {
    const {offlineId} = useParams();
    console.log("맞어?",offlineId);
    return (
        <div>offline : {offlineId}</div>
    )
}

export default OfflineDetail;