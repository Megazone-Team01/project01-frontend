
export async function getLectureApi(activeTab) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/home?type=${activeTab}`);
    if(!response.ok) throw new Error("데이터 요청을 실패했습니다.");
    return response.json();
}