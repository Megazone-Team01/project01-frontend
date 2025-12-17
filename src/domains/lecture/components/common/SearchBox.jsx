import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Button} from "@/components/ui/button.js";
import {Input} from "@/components/ui/input.js";
import {useLocation} from "react-router";
import SelectBox from "@/domains/lecture/components/common/SelectBox.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {executeSearch} from "@/common/store/lecture/lectureStore.js";

function SearchBox() {

    const location = useLocation();
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');


    const lectureName = location.pathname.includes("online")  ? "온라인" : "오프라인";

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        console.log(keyword);
        dispatch(executeSearch(keyword));
    }
    console.log(useSelector(state => state.lecture.searchType))
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl">{lectureName} 강의</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center gap-3.5 p-8 border-2 rounded-md border-gray-200">
                        <Input
                            className="p-5 w-1/2 placeholder:opacity-75"
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="강의를 검색해주세요..."
                        />
                        <Button
                            onClick={handleSearch}
                            className="rounded-4xl block">검색
                        </Button>
                    </div>
                </CardContent>
            </Card>

                <SelectBox />

        </div>
    )
}

export default SearchBox;