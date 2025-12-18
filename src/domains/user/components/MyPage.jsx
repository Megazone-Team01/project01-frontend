import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function MyPage({
    userInfo,
    handleChange,
    handleAddressChange,
    handleSelectAddress,
    addressSearchResults,
    openDaumPostcode, // 추가
    handleEditToggle,
    handleDeleteAccount,
    isEditing,
    loading,
    showPassword,
    setShowPassword,
    showPasswordConfirm,
    setShowPasswordConfirm,
}) {
    if (loading) return <p>로딩중...</p>;

    return (
        <div className="my-profile-page flex flex-col gap-6">
            <div className="profile-top flex gap-8">
                <div className="profile-image flex-shrink-0">
                    <img
                        src={userInfo.profileImg || "https://avatars.githubusercontent.com/u/9919?v=4"}
                        alt="프로필"
                        className="w-48 h-48 rounded-full object-cover"
                    />
                </div>

                <div className="profile-info flex-1 flex flex-col gap-4">
                    {/* 이름 */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">이름</Label>
                        <Input
                            id="name"
                            name="name"
                            value={userInfo.name}
                            onChange={handleChange}
                            placeholder="이름을 입력하세요"
                            disabled={!isEditing}
                        />
                    </div>

                    {/* 주소 */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="address">주소</Label>
                        <div className="flex gap-2">
                            <Input
                                id="zipcode"
                                name="zipcode"
                                value={userInfo.zipcode}
                                placeholder="우편번호"
                                disabled
                                className="w-32"
                            />
                            <Input
                                id="address"
                                name="address"
                                value={userInfo.address}
                                onChange={handleAddressChange}
                                placeholder="주소를 입력하세요"
                                disabled={!isEditing}
                            />
                            {isEditing && (
                                <Button type="button" onClick={openDaumPostcode}>
                                    우편번호 검색
                                </Button>
                            )}
                        </div>
                        <Input
                            id="detail"
                            name="detail"
                            value={userInfo.detail || ""}
                            onChange={handleChange}
                            placeholder="상세 주소"
                            disabled={!isEditing}
                        />
                    </div>

                    {/* 전화번호 */}
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="phone">전화번호</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleChange}
                            placeholder="'-' 없이 입력하세요"
                            disabled={!isEditing}
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div className="flex flex-col gap-1 relative">
                        <Label htmlFor="password">비밀번호</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={userInfo.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요"
                                disabled={!isEditing}
                            />
                            {isEditing && (
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="flex flex-col gap-1 relative">
                        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                        <div className="relative">
                            <Input
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type={showPasswordConfirm ? "text" : "password"}
                                value={userInfo.passwordConfirm}
                                onChange={handleChange}
                                placeholder="비밀번호를 다시 입력하세요"
                                disabled={!isEditing}
                            />
                            {isEditing && (
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                >
                                    {showPasswordConfirm ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>


                    <div className="flex justify-end gap-2 mt-4">
                        {/* 수정 / 저장 버튼 */}
                        <Button className="w-auto px-4" onClick={handleEditToggle} disabled={loading}>
                            {isEditing ? "저장" : "수정"}
                        </Button>

                        <Button
                            className="w-auto px-4"
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={loading}
                        >
                            회원 탈퇴
                        </Button>
                    </div>



                </div>

            </div>
            <div>
                <h2 className="text-2xl font-bold mb-6"> 나의 강좌 </h2>
                <br/>
                <br/>
                <br/>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-6"> 나의 조직 </h2>
            </div>
        </div>
    );
}
