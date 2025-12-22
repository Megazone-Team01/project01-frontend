import SkeletonBox from "@/domains/home/components/Skeleton.jsx";


function Loading() {
    return (
        <>
            {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonBox key={i} />
            ))}
        </>
    );
}

export default Loading;