export const MEETING_STATUS = {
    REJECTED: -1,
    PENDING: 0,
    APPROVED: 1,
    COMPLETED: 2
};

export const MEETING_STATUS_LABEL = {
    [-1]: '반려',
    [0]: '대기',
    [1]: '승인',
    [2]: '완료'
};

export const MEETING_STATUS_COLOR = {
    [-1]: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    [0]: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    [1]: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    [2]: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
};

export const CHANNEL_TYPE = {
    ALL: 'ALL',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE'
};

export const CHANNEL_TYPE_LABEL = {
    ALL: '전체',
    ONLINE: '온라인',
    OFFLINE: '오프라인'
};