
import {Card, CardDescription, CardHeader} from "../../../components/ui/card.js";

export const OrganizationCard = ( { organization } ) => {
    return (
        <Card className="bg-neutral-50 hover:bg-neutral-100 hover:cursor-pointer flex h-64">
            <div className="w-1/2 flex justify-center items-center">
                { /* 아카데미를 대표하는 사진을 저장하는 곳이 없음. 추후 추가되면 수정 필요 */}
                <img className="w-full h-full object-cover" src={"./test.jpeg"} alt={"test Image"}/>
            </div>
            <div className="w-1/2 h-full p-1 flex flex-col justify-center items-center">
                <p className="flex-1 flex justify-center items-center text-base font-bold" id="name">
                    { organization.name }
                </p>
                <p className="flex-1 flex justify-center items-center text-gray-500" id="type">
                    { /* 이름 다음으로 온라인/오프라인 여부를 알려주고 그 다음으로 온라인이면 홈페이지 주소를, */}
                    { /* 오프라인이면 아카데미 주소를 보여주고 싶은데 온오프라인 여부를 나타내는 칼럼이 없음 */}
                    { /* 임의로 addressCode를 넣어둠 */}
                    { organization.addressCode }
                </p>
                { /* Organization에 대한 description이 없음. 추가되면 수정 예정 */}
                <p className="flex-4 flex justify-center items-start text-sm overflow-hidden" id="description">
                    이 부분은 설명에 대한 부분으로 Text 타입이 올 예정이며 내용이 길어졌을 때 어떻게 되는지 확인이
                    필요한 부분입니다. 일반적으로 가로 길이는 초과하는 경우 아래로 자동 줄바꿈을 하게 되는데 문제는
                    이 길이가 세로 길이도 초과하는 경우에는 어떻게 되는지 입니다. 무한히 올라가면 안되니 이름과
                    온라인 여부 위치를 고정시켜 볼까요?
                </p>
            </div>
        </Card>
    );
}

export default OrganizationCard;