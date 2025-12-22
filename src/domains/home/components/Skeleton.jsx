import {Skeleton} from "@/components/ui/skeleton.js";
import {AspectRatio} from "@/components/ui/aspect-ratio.js";

export default function SkeletonBox() {
    return (
        <div className="flex flex-col gap-2 rounded-xl border p-2">
            {/* 이미지 영역 */}
            <AspectRatio ratio={16/9}>
                <Skeleton className="w-full h-full rounded-xl" />
            </AspectRatio>

            {/* 제목 영역 */}
            <Skeleton className="h-5 w-3/4 rounded-md" />

            {/* 설명 영역 */}
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>
    );
}