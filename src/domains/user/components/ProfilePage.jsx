import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.js";
import {Separator} from "@/components/ui/separator.js";
import {Field, FieldLabel, FieldSet} from "@/components/ui/field.js";
import {fileUpload} from "@/common/api/fileApi.js";

export default function ProfilePage({
    userInfo,
    setUserInfo,
    handleChange,
    handleAddressChange,
    handleSelectAddress,
    addressSearchResults,
    openDaumPostcode,
    handleEditToggle,
    handleDeleteAccount,
    isEditing,
    loading,
    showPassword,
    setShowPassword,
    showPasswordConfirm,
    setShowPasswordConfirm,
    handlePhoneChange,
    handleFileChange,
}) {
    if (loading) return <p>로딩중...</p>;

    return (
        <div className="flex flex-col gap-4 px-6 max-w-5xl mx-auto">
            <div className="my-profile-page flex flex-col gap-6">
                <div className="profile-top flex gap-8">
                    <div className="profile-image flex-shrink-0">
                        <img
                            src={userInfo.profileImage || "https://avatars.githubusercontent.com/u/9919?v=4"}
                            alt="프로필"
                            className="w-48 h-48 rounded-full object-cover"
                        />
                        <br/>
                        <Input
                        type="file"
                        disabled={!isEditing}
                        onChange={(e) => handleFileChange(e) }
                        />


                    </div>

                    <div className="profile-info flex-1 flex flex-col gap-4">
                        {/* 회원 역할 */}
                        <div className="flex flex-col gap-1">
                            <Label>회원 역할</Label>
                            <RadioGroup
                                value={userInfo.roleName}
                                onValueChange={(val) => setUserInfo(prev => ({ ...prev, roleName: val }))}
                                disabled={true}
                                className="flex gap-4"
                            >
                                {["STUDENT", "TEACHER"].map((val) => (
                                    <div key={val} className="flex items-center gap-2">
                                        <RadioGroupItem value={val} id={val.toLowerCase()} />
                                        <Label htmlFor={val.toLowerCase()}>
                                            {val === "STUDENT" ? "학생" : "강사"}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* 이메일 */}
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="email">이메일</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    placeholder="이메일을 입력하세요"
                                    disabled={true}
                                    className={`${userInfo.email ? "text-black placeholder:text-black" : "placeholder:text-gray-400"}`}
                                />
                        </div>

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
                                    className={`${userInfo.name ? "text-black placeholder:text-black" : "placeholder:text-gray-400"}`}
                                />
                        </div>

                        {/* 전화번호 */}
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="phone">전화번호</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={userInfo.phone}
                                    onChange={handlePhoneChange}
                                    placeholder="'-' 없이 입력하세요"
                                    disabled={!isEditing}
                                    className={`${userInfo.phone ? "text-black placeholder:text-black" : "placeholder:text-gray-400"}`}
                                />
                        </div>

                        {/* 주소 */}
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="address">주소</Label>
                                <div className="flex gap-2">
{/*                                     <Input */}
{/*                                         id="zipcode" */}
{/*                                         name="zipcode" */}
{/*                                         value={userInfo.addressCode} */}
{/*                                         placeholder="우편번호" */}
{/*                                         disabled */}
{/*                                         className={`${userInfo.addressCode ? "text-black placeholder:text-black" : "placeholder:text-gray-400"}`} */}
{/*                                     /> */}
                                    <Input
                                        id="address"
                                        name="address"
                                        value={userInfo.address}
                                        onChange={handleAddressChange}
                                        placeholder="주소를 입력하세요"
                                        disabled={!isEditing}
                                        className={`${userInfo.address ? "text-black placeholder:text-black" : "placeholder:text-gray-400"}`}
                                    />
                                    {isEditing && (
                                        <Button type="button" onClick={openDaumPostcode}>
                                            우편번호 검색
                                        </Button>
                                    )}
                                </div>
                                <Input
                                    id="addressDetail"
                                    name="addressDetail"
                                    value={userInfo.addressDetail || ""}
                                    onChange={handleChange}
                                    placeholder="상세 주소"
                                    disabled={!isEditing}
                                    className={`${userInfo.addressDetail ? "text-black placeholder:text-black" : "placeholder:text-gray-400"}`}
                                />
                        </div>



                        {/* 회원 타입 */}
                        <div className="flex flex-col gap-1">
                            <Label>회원 타입</Label>
                                <RadioGroup
                                    value={userInfo.type}
                                    onValueChange={(val) => setUserInfo(prev => ({ ...prev, type: val }))}
                                    disabled={!isEditing}
                                    className="flex gap-4"
                                >
                                    {["ALL", "ONLINE", "OFFLINE"].map((val) => (
                                        <div key={val} className="flex items-center gap-2">
                                            <RadioGroupItem value={val} id={val.toLowerCase()} />
                                            <Label htmlFor={val.toLowerCase()}>
                                                {val === "ALL" ? "모두" : val === "ONLINE" ? "온라인" : "오프라인"}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
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
            </div>
        <Separator className="my-2"/>
        <Field>
            <FieldLabel className="text-md font-bold"> 소속 기관 </FieldLabel>
            <div className="flex flex-col gap-2">
                {
                    userInfo.organizations.map( (name, index) => (
                        <Label key={index + "_1"}> { name }</Label>
                    ))
                }
            </div>
        </Field>
        <Separator className="my-2"/>
        <Field>
            <FieldLabel className="text-md font-bold">
                { userInfo.roleName === "TEACHER" ? "담당 강의" : "수강 강의" }
            </FieldLabel>
            <div className="flex flex-col gap-2">
                {
                    userInfo.lectures.map( (name, index) => (
                        <Label key={index + "_1"}> { name }</Label>
                        ))
                }
            </div>
        </Field>
        </div>
    );
}
