import React, {useEffect, useState} from 'react';
import { MapPin, Users, Calendar, Clock, DollarSign, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {useUploadLecture} from "@/domains/lecture/hook/useUploadLecture.js";
import axiosInstance from "@/common/api/axiosInstance.js";

export default function OfflineUpload() {
    const mutation = useUploadLecture("offline");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    // 카테고리 데이터 (API에서 가져올 예정)
    const [categories, setCategories] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedDetailCategory, setSelectedDetailCategory] = useState("");
    const [organizations, setOrganizations] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        startAt: '',
        endAt: '',
        day: '',
        startTime: '',
        endTime: '',
        maxNum: '',
        organizationId: '',
        roomId: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    // 요일 옵션
    const days = [
        { value: 'monday', label: '월요일' },
        { value: 'tuesday', label: '화요일' },
        { value: 'wednesday', label: '수요일' },
        { value: 'thursday', label: '목요일' },
        { value: 'friday', label: '금요일' },
        { value: 'saturday', label: '토요일' },
        { value: 'sunday', label: '일요일' },
    ];

    // 기관 옵션
    // API 호출 함수
    const fetchOrganizationsWithRooms = async () => {
        try {
            const response = await axiosInstance.get('/v1/organization/with-rooms');
            const data = response.data;
            console.log("organizations with rooms:", data);

            setOrganizations(data);
        } catch (error) {
            console.error('조직/강의실 로딩 실패:', error);
        }
    };

    const handleOrganizationChange = (value) => {
        // 1. formData 업데이트 (organizationId 저장, roomId 초기화)
        setFormData(prev => ({
            ...prev,
            organizationId: value,
            roomId: '' // 강의실 선택 초기화
        }));

        // 2. 에러 초기화
        setErrors(prev => ({
            ...prev,
            organizationId: null,
            roomId: null
        }));

        // 3. 선택된 조직의 강의실만 표시
        const selectedOrg = organizations.find(org => org.id.toString() === value);
        if (selectedOrg) {
            setRooms(selectedOrg.rooms);
        } else {
            setRooms([]);
        }
    };

    // // 강의실 옵션
    // const rooms = [
    //     { value: '1', label: '101호 (30명)' },
    //     { value: '2', label: '102호 (50명)' },
    //     { value: '3', label: '201호 (20명)' },
    //     { value: '4', label: '202호 (40명)' },
    // ];


    // 카테고리 데이터 가져오기
    useEffect(() => {
        fetchCategories();
        fetchOrganizationsWithRooms();
    }, []);

    const fetchCategories = async () => {
        try {
            // 실제 API 호출
            const response = await axiosInstance.get('/v1/category/lecture');
            const data = response.data; // axios는 이미 JSON 파싱이 완료됨
            console.log("category : ", data);
            // 임시 목업 데이터 (위 SQL과 동일한 구조)


            setCategories(data);
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
        }
    };

    // 메인 카테고리 목록
    const mainCategories = categories;

    // 서브 카테고리 목록 (선택된 메인 카테고리의 자식들)
    const subCategories = selectedMainCategory
        ? categories.find(c => c.code === selectedMainCategory)?.children || []
        : [];

    // 상세 카테고리 목록 (선택된 서브 카테고리의 자식들)
    const detailCategories = selectedSubCategory
        ? subCategories.find(c => c.code === selectedSubCategory)?.children || []
        : [];

    // 카테고리 선택 핸들러들 수정
    const handleMainCategoryChange = (value) => {
        setSelectedMainCategory(value);
        setSelectedSubCategory("");
        setSelectedDetailCategory("");

        // ✅ LEC는 제외하고 저장 (백엔드에서 LEC만 받았으므로)
        // 또는 전체 경로 저장
        setFormData(prev => ({ ...prev, category: value }));
        setErrors(prev => ({ ...prev, category: null }));
    };

    const handleSubCategoryChange = (value) => {
        setSelectedSubCategory(value);
        setSelectedDetailCategory("");

        // ✅ 대분류_중분류 형태로 조합
        const fullPath = `${selectedMainCategory}_${value}`;
        setFormData(prev => ({ ...prev, category: fullPath }));
        setErrors(prev => ({ ...prev, category: null }));
    };

    const handleDetailCategoryChange = (value) => {
        setSelectedDetailCategory(value);

        // ✅ 대분류_중분류_소분류 형태로 조합
        const fullPath = `${selectedMainCategory}_${selectedSubCategory}_${value}`;
        setFormData(prev => ({ ...prev, category: fullPath }));
        setErrors(prev => ({ ...prev, category: null }));
    };


    const onThumbnailChange = (event) => {
        const { files } = event.target;
        if (!files || files.length === 0) return;

        const file = files[0];

        if (!file.type.includes("image/")) {
            setErrors(prev => ({ ...prev, thumbnail: "이미지 파일만 업로드 가능합니다." }));
            return;
        }

        const url = URL.createObjectURL(file);
        setThumbnailPreview(url);
        setThumbnailFile(file);
        setErrors(prev => ({ ...prev, thumbnail: null }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "강의 제목을 입력해주세요.";
        }
        if (!formData.description.trim()) {
            newErrors.description = "강의 설명을 입력해주세요.";
        }
        if (!formData.category) {
            newErrors.category = "카테고리를 선택해주세요.";
        }
        if (!formData.price) {
            newErrors.price = "가격을 입력해주세요.";
        } else if (isNaN(formData.price) || Number(formData.price) < 0) {
            newErrors.price = "올바른 가격을 입력해주세요.";
        }
        if (!formData.startAt) {
            newErrors.startAt = "시작일을 선택해주세요.";
        }
        if (!formData.endAt) {
            newErrors.endAt = "종료일을 선택해주세요.";
        }
        if (formData.startAt && formData.endAt && new Date(formData.startAt) >= new Date(formData.endAt)) {
            newErrors.endAt = "종료일은 시작일보다 늦어야 합니다.";
        }
        if (!formData.day) {
            newErrors.day = "요일을 선택해주세요.";
        }
        if (!formData.startTime) {
            newErrors.startTime = "시작 시간을 선택해주세요.";
        }
        if (!formData.endTime) {
            newErrors.endTime = "종료 시간을 선택해주세요.";
        }
        if (!formData.maxNum) {
            newErrors.maxNum = "최대 인원을 입력해주세요.";
        } else if (isNaN(formData.maxNum) || Number(formData.maxNum) <= 0) {
            newErrors.maxNum = "올바른 인원수를 입력해주세요.";
        }
        if (!formData.organizationId) {
            newErrors.organizationId = "소속 기관을 선택해주세요.";
        }
        if (!formData.roomId) {
            newErrors.roomId = "강의실을 선택해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const submitData = new FormData();
        if (thumbnailFile) {
            submitData.append('thumbnail', thumbnailFile);
        }

        try {
            Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
            console.log("submitData: ", ...submitData);
            mutation.mutate(submitData);
            console.log('등록할 데이터:', {
                thumbnail: thumbnailFile?.name,
                ...formData,
            });

            alert('오프라인 강의가 성공적으로 등록되었습니다!');

            setThumbnailPreview('');
            setThumbnailFile(null);
            setFormData({
                name: '',
                description: '',
                category: '',
                price: '',
                startAt: '',
                endAt: '',
                day: '',
                startTime: '',
                endTime: '',
                maxNum: '',
                organizationId: '',
                roomId: '',
            });

        } catch (error) {
            console.error('등록 실패:', error);
            setErrors({ submit: '등록에 실패했습니다.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900">오프라인 강의 등록</h1>
                    <p className="text-slate-600">새로운 오프라인 강의를 개설하고 학생들을 모집하세요</p>
                </div>

                {errors.submit && (
                    <Alert variant="destructive">
                        <AlertDescription>{errors.submit}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* 썸네일 업로드 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="w-5 h-5" />
                                썸네일 이미지
                            </CardTitle>
                            <CardDescription>강의 목록에 표시될 대표 이미지를 업로드하세요</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <label
                                htmlFor="thumbnail"
                                className="border-2 border-dashed rounded-lg h-64 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden bg-slate-50"
                            >
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="썸네일 미리보기"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center space-y-2">
                                        <Image className="w-12 h-12 text-slate-400 mx-auto" />
                                        <div className="text-sm text-slate-600">
                                            클릭하여 썸네일 업로드
                                        </div>
                                    </div>
                                )}
                            </label>
                            <input
                                onChange={onThumbnailChange}
                                type="file"
                                id="thumbnail"
                                name="thumbnail"
                                accept="image/*"
                                className="hidden"
                            />
                            {errors.thumbnail && (
                                <p className="text-sm text-red-500 mt-2">{errors.thumbnail}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 기본 정보 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>기본 정보</CardTitle>
                            <CardDescription>강의의 기본 정보를 입력하세요</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">강의 제목 *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="예: Java 프로그래밍 기초반"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">강의 설명 *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="강의에 대한 자세한 설명을 입력해주세요."
                                    rows={6}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 카테고리 */}

                    {/* 카테고리 (계층적) */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>카테고리</CardTitle>
                            <CardDescription>강의 분류를 선택하세요 (대분류 → 중분류 → 소분류)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* 1단계: 메인 카테고리 */}
                            <div className="space-y-2">
                                <Label htmlFor="mainCategory">대분류 *</Label>
                                <Select
                                    value={selectedMainCategory}
                                    onValueChange={handleMainCategoryChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="대분류 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mainCategories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.code}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 2단계: 서브 카테고리 */}
                            {selectedMainCategory && subCategories.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="subCategory">중분류 *</Label>
                                    <Select
                                        value={selectedSubCategory}
                                        onValueChange={handleSubCategoryChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="중분류 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.code}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* 3단계: 상세 카테고리 */}
                            {selectedSubCategory && detailCategories.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="detailCategory">소분류 *</Label>
                                    <Select
                                        value={selectedDetailCategory}
                                        onValueChange={handleDetailCategoryChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="소분류 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {detailCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.code}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* 선택된 카테고리 표시 */}
                            {formData.category && (
                                <div className="text-sm text-slate-600 bg-slate-100 p-3 rounded">
                                    선택된 카테고리: <span className="font-semibold">{formData.category}</span>
                                </div>
                            )}

                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 가격 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                가격 설정
                            </CardTitle>
                            <CardDescription>강의 수강료를 설정하세요</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="price">가격 (원) *</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="예: 200000"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 강의 기간 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                시작일
                            </CardTitle>
                            <CardDescription>강의 시작 날짜</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="startAt">시작일 *</Label>
                            <Input
                                id="startAt"
                                name="startAt"
                                type="date"
                                value={formData.startAt}
                                onChange={handleInputChange}
                            />
                            {errors.startAt && (
                                <p className="text-sm text-red-500">{errors.startAt}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                종료일
                            </CardTitle>
                            <CardDescription>강의 종료 날짜</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="endAt">종료일 *</Label>
                            <Input
                                id="endAt"
                                name="endAt"
                                type="date"
                                value={formData.endAt}
                                onChange={handleInputChange}
                            />
                            {errors.endAt && (
                                <p className="text-sm text-red-500">{errors.endAt}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 수업 요일 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>수업 요일</CardTitle>
                            <CardDescription>정기 수업 요일을 선택하세요</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="day">요일 *</Label>
                            <Select
                                value={formData.day}
                                onValueChange={(value) => handleSelectChange('day', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {days.map(day => (
                                        <SelectItem key={day.value} value={day.label}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.day && (
                                <p className="text-sm text-red-500">{errors.day}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 수업 시간 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                수업 시간
                            </CardTitle>
                            <CardDescription>시작 시간과 종료 시간</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">시작 시간 *</Label>
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                />
                                {errors.startTime && (
                                    <p className="text-sm text-red-500">{errors.startTime}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">종료 시간 *</Label>
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                />
                                {errors.endTime && (
                                    <p className="text-sm text-red-500">{errors.endTime}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 최대 인원 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                수강 인원
                            </CardTitle>
                            <CardDescription>최대 수강 가능 인원</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="maxNum">최대 인원 *</Label>
                            <Input
                                id="maxNum"
                                name="maxNum"
                                type="number"
                                min="1"
                                value={formData.maxNum}
                                onChange={handleInputChange}
                                placeholder="예: 20"
                            />
                            {errors.maxNum && (
                                <p className="text-sm text-red-500">{errors.maxNum}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 소속 기관 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>소속 기관</CardTitle>
                            <CardDescription>강의를 개설할 교육 기관</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="organization">소속 기관 *</Label>
                            <Select
                                value={formData.organizationId}
                                onValueChange={handleOrganizationChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map(org => (
                                        <SelectItem key={org.id} value={org.id.toString()}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.organizationId && (
                                <p className="text-sm text-red-500">{errors.organizationId}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 강의실 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                강의실 선택
                            </CardTitle>
                            <CardDescription>강의가 진행될 강의실을 선택하세요</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="room">강의실 *</Label>
                            <Select
                                value={formData.roomId}
                                onValueChange={(value) => handleSelectChange('roomId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={formData.organizationId ? "강의실 선택" : "먼저 조직을 선택하세요"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms.map(room => (
                                        <SelectItem

                                            key={room.id} value={room.id.toString()}>
                                            {room.name} ({room.maxNum}명)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.roomId && (
                                <p className="text-sm text-red-500">{errors.roomId}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 제출 버튼 */}
                <div className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.history.back()}
                    >
                        취소
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="min-w-[150px]"
                    >
                        {isSubmitting ? '등록 중...' : '강의 등록'}
                    </Button>
                </div>
            </div>
        </div>
    );
}