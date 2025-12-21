import React, { useState } from 'react';
import { Film } from 'lucide-react';


export default function Upload() {

    const maxSize = 50 * 1024 * 1024; // 50MB
    const [preview, setPreview] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onVideoChange = (event) => {
        const { files } = event.target;

        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];

        if (file.size > maxSize) {
            alert("파일이 너무 큽니다! (최대 50MB)");
            return;
        }

        if (!file.type.includes("video/")) {
            alert("영상 파일만 업로드 가능합니다.");
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);
        setVideoFile(file);

        setErrors(prev => ({ ...prev, video: null }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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

        if (!formData.title.trim()) {
            newErrors.title = "제목을 입력해주세요.";
        }

        if (!formData.description.trim()) {
            newErrors.description = "설명을 입력해주세요.";
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
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);

        try {
            // 여기에 실제 API 호출 로직을 추가하세요
            // const response = await fetch('/api/upload-video', {
            //   method: 'POST',
            //   body: submitData,
            // });

            console.log('업로드할 데이터:', {
                video: videoFile.name,
                title: formData.title,
                description: formData.description,
            });

            alert('업로드 완료! (실제 업로드는 API 연결 후 작동합니다)');

            setPreview('');
            setVideoFile(null);
            setFormData({ title: '', description: '' });

        } catch (error) {
            console.error('업로드 실패:', error);
            alert('업로드에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-5">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">영상 업로드</h1>

                <div className="flex flex-col gap-5">
                    {/* 영상 업로드 영역 */}
                    <label
                        htmlFor="video"
                        className="border-2 aspect-video flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden"
                    >
                        {preview ? (
                            <video
                                src={preview}
                                controls
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                        ) : (
                            <>
                                <Film className="w-20 h-20 text-gray-400" />
                                <div className="text-neutral-400 text-sm mt-2">
                                    {errors.video || "영상을 추가해주세요. (최대 50MB)"}
                                </div>
                            </>
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

                    {/* 제목 입력 */}
                    <div className="flex flex-col gap-2">
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="제목"
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.title && (
                            <span className="text-red-500 text-sm">{errors.title}</span>
                        )}
                    </div>

                    {/* 설명 입력 */}
                    <div className="flex flex-col gap-2">
            <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="자세한 설명"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
                        {errors.description && (
                            <span className="text-red-500 text-sm">{errors.description}</span>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                            isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSubmitting ? '업로드 중...' : '작성 완료'}
                    </button>
                </div>
            </div>
        </div>
    )
}