import {Button} from "@/components/ui/button.js";
import {useDispatch, useSelector} from "react-redux";
import {setSearchType} from "@/common/store/lecture/lectureStore.js";


const SEARCH_TYPES = [
    { code: 1, label: '최신순' },
    { code: 2, label: '날짜순' },
    { code: 3, label: '인기순' }
];
function SelectBox() {
    const dispatch = useDispatch();
    const searchType = useSelector((state) => state.lecture.searchType);

    const handleChange = (code) => {
        dispatch(setSearchType(code));
    };

    return (
        <div className="flex justify-start items-center gap-2 my-2">
            {SEARCH_TYPES.map(({code, label}) => (
                <Button
                key={code}
                onClick={() => handleChange(code)}
                variant={searchType === code ? "default" : "outline"}
                className={searchType === code ? "" : "bg-white"}
                >
                    {label}
                </Button>
            ))}
        </div>
    )
}

export default SelectBox;