import React, { useState, useEffect } from 'react';
import { Film, Image, Upload, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUploadLecture } from "@/domains/lecture/hook/useUploadLecture.js";
import axiosInstance from "@/common/api/axiosInstance.js";

export default function OnlineUpload() {
    const mutation = useUploadLecture("online");
    const maxSize = 500 * 1024 * 1024; // 500MB

    const [videoPreview, setVideoPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    // 카테고리 데이터
    const [categories, setCategories] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedDetailCategory, setSelectedDetailCategory] = useState("");

    // 조직 데이터
    const [organizations, setOrganizations] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        startAt: '',
        endAt: '',
        organizationId: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 데이터 가져오기
    useEffect(() => {
        fetchCategories();
        fetchOrganizations();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/v1/category/lecture');
            const data = response.data;
            console.log("category:", data);
            setCategories(data);
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const response = await axiosInstance.get('/v1/organization/with-rooms');
            const data = response.data;
            console.log("organizations:", data);
            setOrganizations(data);
        } catch (error) {
            console.error('조직 로딩 실패:', error);
        }
    };

    // 메인 카테고리 목록
    const mainCategories = categories;

    // 서브 카테고리 목록
    const subCategories = selectedMainCategory
        ? categories.find(c => c.code === selectedMainCategory)?.children || []
        : [];

    // 상세 카테고리 목록
    const detailCategories = selectedSubCategory
        ? subCategories.find(c => c.code === selectedSubCategory)?.children || []
        : [];

    // 카테고리 선택 핸들러
    const handleMainCategoryChange = (value) => {
        setSelectedMainCategory(value);
        setSelectedSubCategory("");
        setSelectedDetailCategory("");
        setFormData(prev => ({ ...prev, category: value }));
        setErrors(prev => ({ ...prev, category: null }));
    };

    const handleSubCategoryChange = (value) => {
        setSelectedSubCategory(value);
        setSelectedDetailCategory("");
        const fullPath = `${selectedMainCategory}_${value}`;
        setFormData(prev => ({ ...prev, category: fullPath }));
        setErrors(prev => ({ ...prev, category: null }));
    };

    const handleDetailCategoryChange = (value) => {
        setSelectedDetailCategory(value);
        const fullPath = `${selectedMainCategory}_${selectedSubCategory}_${value}`;
        setFormData(prev => ({ ...prev, category: fullPath }));
        setErrors(prev => ({ ...prev, category: null }));
    };

    const onVideoChange = (event) => {
        const { files } = event.target;
        if (!files || files.length === 0) return;

        const file = files[0];

        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, video: "파일이 너무 큽니다! (최대 500MB)" }));
            return;
        }

        if (!file.type.includes("video/")) {
            setErrors(prev => ({ ...prev, video: "영상 파일만 업로드 가능합니다." }));
            return;
        }

        const url = URL.createObjectURL(file);
        setVideoPreview(url);
        setVideoFile(file);
        setErrors(prev => ({ ...prev, video: null }));
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

        if (!videoFile) {
            newErrors.video = "영상을 추가해주세요.";
        }
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
        if (!formData.organizationId) {
            newErrors.organizationId = "소속 기관을 선택해주세요.";
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

        // 1. 파일들을 먼저 추가
        submitData.append('video', videoFile);
        if (thumbnailFile) {
            submitData.append('thumbnail', thumbnailFile);
        }

        // 2. 나머지 폼 데이터 추가
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        // FormData 내용 확인 (디버깅용)
        console.log('=== FormData 내용 ===');
        for (let [key, value] of submitData.entries()) {
            if (value instanceof File) {
                console.log(key, ':', value.name, `(${value.size} bytes)`);
            } else {
                console.log(key, ':', value);
            }
        }

        try {
            // ✅ mutate 사용 (mutateAsync 대신)
            mutation.mutate(submitData);

            // ✅ 폼 초기화를 여기서 하지 말고 onSuccess에서 하는 것이 좋습니다
            // 일단은 오프라인과 동일하게 처리
            setVideoPreview('');
            setThumbnailPreview('');
            setVideoFile(null);
            setThumbnailFile(null);
            setSelectedMainCategory("");
            setSelectedSubCategory("");
            setSelectedDetailCategory("");
            setFormData({
                name: '',
                description: '',
                category: '',
                price: '',
                startAt: '',
                endAt: '',
                organizationId: '',
            });

        } catch (error) {
            console.error('업로드 실패:', error);
            setErrors({ submit: error.message || '업로드에 실패했습니다.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900">온라인 강의 업로드</h1>
                    <p className="text-slate-600">새로운 강의를 등록하고 학생들과 공유하세요</p>
                </div>

                {errors.submit && (
                    <Alert variant="destructive">
                        <AlertDescription>{errors.submit}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* 영상 업로드 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Film className="w-5 h-5" />
                                강의 영상
                            </CardTitle>
                            <CardDescription>강의 동영상 파일을 업로드하세요 (최대 500MB)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <label
                                htmlFor="video"
                                className="border-2 border-dashed rounded-lg aspect-video flex items-center justify-center flex-col cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden bg-slate-50"
                            >
                                {videoPreview ? (
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center space-y-3">
                                        <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                                        <div className="text-sm text-slate-600">
                                            클릭하여 영상 업로드
                                        </div>
                                    </div>
                                )}
                            </label>
                            <input
                                onChange={onVideoChange}
                                type="file"
                                id="video"
                                name="video"
                                accept="video/*"
                                className="hidden"
                            />
                            {errors.video && (
                                <p className="text-sm text-red-500 mt-2">{errors.video}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 썸네일 업로드 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="w-5 h-5" />
                                썸네일 이미지
                            </CardTitle>
                            <CardDescription>강의 목록에 표시될 대표 이미지 (선택사항)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <label
                                htmlFor="thumbnail"
                                className="border-2 border-dashed rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden bg-slate-50"
                            >
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="썸네일 미리보기"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center space-y-2">
                                        <Image className="w-10 h-10 text-slate-400 mx-auto" />
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
                                    placeholder="예: React 완벽 가이드"
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

                    {/* 카테고리 (계층적) */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>카테고리</CardTitle>
                            <CardDescription>강의 분류를 선택하세요 (대분류 → 중분류 → 소분류)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* 대분류 */}
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

                            {/* 중분류 */}
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

                            {/* 소분류 */}
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
                                placeholder="예: 50000"
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 소속 기관 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>소속 기관</CardTitle>
                            <CardDescription>강의를 등록할 교육 기관</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="organization">소속 기관 *</Label>
                            <Select
                                value={formData.organizationId}
                                onValueChange={(value) => handleSelectChange('organizationId', value)}
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

                    {/* 강의 기간 - 시작일 */}
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

                    {/* 강의 기간 - 종료일 */}
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
                        {isSubmitting ? '업로드 중...' : '강의 업로드'}
                    </Button>
                </div>
            </div>
        </div>
    );
}