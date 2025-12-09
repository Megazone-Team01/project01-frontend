
export async function getLectureApi(activeTab) {
    const response = await fetch(`http://localhost:8080/api/home?type=${activeTab}`);
    if(!response.ok) throw new Error("데이터 요청을 실패했습니다.");
    return response.json();
}