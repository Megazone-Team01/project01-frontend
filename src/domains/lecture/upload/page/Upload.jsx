import React, { useState } from 'react';
import { Film, Image, Upload, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LectureUpload() {
    const maxSize = 500 * 1024 * 1024; // 500MB
    const [videoPreview, setVideoPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);

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

    const categories = [
        { value: 'programming', label: '프로그래밍' },
        { value: 'design', label: '디자인' },
        { value: 'business', label: '비즈니스' },
        { value: 'language', label: '외국어' },
        { value: 'marketing', label: '마케팅' },
    ];

    const organizations = [
        { value: '1', label: 'ABC 교육원' },
        { value: '2', label: 'XYZ 아카데미' },
        { value: '3', label: '코딩스쿨' },
    ];

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
        submitData.append('video', videoFile);
        if (thumbnailFile) {
            submitData.append('thumbnail', thumbnailFile);
        }
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('category', formData.category);
        submitData.append('price', formData.price);
        submitData.append('startAt', formData.startAt);
        submitData.append('endAt', formData.endAt);
        submitData.append('organizationId', formData.organizationId);

        try {
            // 실제 API 호출
            // const response = await fetch('/api/lectures/upload', {
            //   method: 'POST',
            //   body: submitData,
            // });

            console.log('업로드할 데이터:', {
                video: videoFile.name,
                thumbnail: thumbnailFile?.name,
                ...formData,
            });

            alert('강의가 성공적으로 업로드되었습니다!');

            setVideoPreview('');
            setThumbnailPreview('');
            setVideoFile(null);
            setThumbnailFile(null);
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
            setErrors({ submit: '업로드에 실패했습니다.' });
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
                    {/* 영상 업로드 카드 */}
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

                    {/* 썸네일 업로드 카드 */}
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

                    {/* 기본 정보 카드 */}
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

                    {/* 카테고리 및 가격 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>카테고리</CardTitle>
                            <CardDescription>강의 분류를 선택하세요</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="category">카테고리 *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleSelectChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>가격 설정</CardTitle>
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

                    {/* 강의 기간 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                시작일
                            </CardTitle>
                            <CardDescription>강의 시작 날짜와 시간</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="startAt">강의 시작일 *</Label>
                            <Input
                                id="startAt"
                                name="startAt"
                                type="datetime-local"
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
                            <CardDescription>강의 종료 날짜와 시간</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Label htmlFor="endAt">강의 종료일 *</Label>
                            <Input
                                id="endAt"
                                name="endAt"
                                type="datetime-local"
                                value={formData.endAt}
                                onChange={handleInputChange}
                            />
                            {errors.endAt && (
                                <p className="text-sm text-red-500">{errors.endAt}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 소속 기관 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>소속 기관</CardTitle>
                            <CardDescription>강의를 등록할 교육 기관을 선택하세요</CardDescription>
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
                                        <SelectItem key={org.value} value={org.value}>
                                            {org.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.organizationId && (
                                <p className="text-sm text-red-500">{errors.organizationId}</p>
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