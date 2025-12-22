import { MEETING_STATUS_LABEL, MEETING_STATUS_COLOR } from '../constants/meetingStatus';

const MeetingStatusBadge = ({ status }) => {
    const label = MEETING_STATUS_LABEL[status] || '알수없음';
    const colors = MEETING_STATUS_COLOR[status] || MEETING_STATUS_COLOR[0];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
            {label}
        </span>
    );
};

export default MeetingStatusBadge;