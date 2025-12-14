

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.js";
import {Button} from "@/components/ui/button.js";
import {Input} from "@/components/ui/input.js";
import {useLocation} from "react-router";




function SearchBox() {
    const location = useLocation();
    const lectureName = location.pathname === "online" ? "온라인" : "오프라인";
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
                            name="search"
                            placeholder="Search here..."
                        />
                        <Button className="rounded-4xl block">검색</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SearchBox;