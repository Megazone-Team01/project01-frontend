
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

function LectureDetailSkeleton() {
    return (
        <div className="max-w-screen-lg mx-auto p-2">
            <div className="flex flex-col gap-5 sm:grid sm:grid-cols-[1fr_2fr]">
                {/* 썸네일 스켈레톤 */}
                <Skeleton className="w-[400px] h-[300px]" />

                <div>
                    {/* 배지 섹션 스켈레톤 */}
                    <section className="flex gap-2 mb-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                    </section>

                    <section className="flex flex-col gap-3">
                        <div className="my-2 flex justify-start items-center gap-2">
                            <div className="w-full">
                                {/* 제목과 상태 배지 스켈레톤 */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Skeleton className="h-10 w-64" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                                {/* 설명 스켈레톤 */}
                                <Skeleton className="h-5 w-full max-w-md" />
                            </div>
                        </div>

                        {/* 강의 정보 박스 스켈레톤 */}
                        <div>
                            <div className="p-2 min-h-[150px] bg-neutral-100 border-black rounded-2xl">
                                <ul className="flex flex-col gap-2 mb-3">
                                    <li><Skeleton className="h-5 w-40" /></li>
                                    <li><Skeleton className="h-5 w-48" /></li>
                                    <li><Skeleton className="h-5 w-32" /></li>
                                    <li><Skeleton className="h-5 w-56" /></li>
                                </ul>
                            </div>
                        </div>

                        {/* 버튼 스켈레톤 */}
                        <div>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </section>
                </div>
            </div>

            <Separator className="my-3.5" />

            {/* 조직 카드 스켈레톤 */}
            <section>
                <div className="p-4 border rounded-lg">
                    <Skeleton className="h-7 w-48 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </section>
        </div>
    );
}

export default LectureDetailSkeleton;