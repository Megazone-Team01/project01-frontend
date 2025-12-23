function Footer() {
    return (
        <footer className="w-full bg-primary text-white py-16 shadow-lg">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 px-4 md:px-8">

                {/* 좌측: 브랜드 + 슬로건 */}
                <div className="flex flex-col md:flex-1 ml-4 md:ml-6">
                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg
                                   bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary mb-4 md:mb-6
                                   [-webkit-text-stroke:0.25px_black]">
                        LinkEd
                    </h1>
                    <p className="text-xl md:text-2xl opacity-80 mb-4">
                        Learn. Connect. Grow.
                    </p>
                    <span className="block w-24 h-1 bg-white mt-3 rounded text-center"></span>
                </div>

                {/* 세로 구분선 */}
                <div className="hidden md:block border-l-2 border-white/30 self-stretch"></div>

                {/* 우측: 회사 정보 (좌측 정렬) */}
                <div className="flex flex-col md:flex-1 gap-4 text-sm md:text-base opacity-90">
                    <InfoRow label="사업명" value="LinkEd" />
                    <InfoRow label="대표자" value="박민경, 임창완, 임성제, 허혜인" />
                    <InfoRow label="전화번호" value="010-1234-5678" />
                    <InfoRow label="이메일" value="contact@linked.com" />
                    <InfoRow label="사업자등록번호" value="123-45-67890" />
                    <InfoRow label="위치" value="서울특별시 강남구 테헤란로 123" />
                    <InfoRow label="고객센터 운영" value="월~금 09:00 - 18:00" />
                </div>
            </div>

            {/* 하단 저작권 표시 */}
            <div className="mt-10 border-t border-white/30 pt-4 text-center text-sm opacity-70">
                © {new Date().getFullYear()} LinkEd. All rights reserved.
            </div>
        </footer>
    );
}

// 정보 행 컴포넌트 (hover 효과)
function InfoRow({ label, value }) {
    return (
        <div className="flex justify-start gap-2 hover:text-yellow-300 transition-all duration-300">
            <span className="font-semibold">{label}:</span>
            <span>{value}</span>
        </div>
    );
}

export default Footer;
