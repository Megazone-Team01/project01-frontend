import {useParams} from "react-router";

function OfflineDetail() {
    const {offlineId} = useParams();

    return (
        <div>offline : {offlineId}</div>
    )
}

export default OfflineDetail;