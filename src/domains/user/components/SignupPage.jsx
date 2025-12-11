import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group.js";
import useSignupForm from "../hook/useSignupForm";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


export default function SignupPage() {
    const { form, handleChange, handlePhoneChange, handleEmailChange, handlePasswordChange, handlePasswordConfirmChange,
            handleSubmit, loading, error, phoneError, emailError, passwordError, passwordConfirmError,
            showPassword, setShowPassword, showPasswordConfirm, setShowPasswordConfirm,setForm, setError } = useSignupForm();

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="flex flex-col gap-4">
                {/* 이메일 */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center">
                            <Label htmlFor="email" className="whitespace-nowrap">
                                이메일
                            </Label>
                                {emailError && (
                                    <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                                        {emailError}
                                    </div>
                                )}
                        </div>
                    </div>
                    <Input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleEmailChange}
                        placeholder="이메일을 입력하세요"
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
                            value={form.password}
                            onChange={handlePasswordChange}
                            placeholder="비밀번호를 입력하세요"
                        />
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
                    </div>
                    {/* 에러 출력 */}
                    {passwordError && (
                        <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            {passwordError}
                        </div>
                    )}
                </div>


                {/* 비밀번호 확인 */}
                <div className="flex flex-col gap-1 relative">
                    <Label htmlFor="passwordConfirm">비밀번호 확인</Label>

                    <div className="relative">
                        <Input
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type={showPasswordConfirm ? "text" : "password"}
                            value={form.passwordConfirm}
                            onChange={handlePasswordConfirmChange}
                            placeholder="비밀번호를 다시 입력하세요"
                        />

                        {/* 비밀번호 확인 가능한 버튼 */}
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
                    </div>

                    {/* 에러 출력 */}
                    {passwordConfirmError && (
                        <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            {passwordConfirmError}
                        </div>
                    )}
                </div>

                {/* 이름 */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="name">이름</Label>
                    <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="이름을 입력하세요"
                    />
                </div>

                {/* 전화번호 */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center">
                            <Label htmlFor="phone" className="whitespace-nowrap">
                                전화번호
                            </Label>
                                {phoneError && (
                                <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                                {phoneError}
                                </div>
                            )}
                        </div>
                    </div>
                    <Input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        placeholder="'-' 없이 입력하세요"
                    />
                </div>


                {/* 회원 타입 */}
                <div className="flex flex-col gap-1">
                    <Label>회원 타입</Label>
                    <RadioGroup
                        value={form.type}
                        onValueChange={(val) => setForm({ ...form, type: val })}
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

                {/* 제출 버튼 */}
                <Button type="submit" disabled={loading} className="mt-2">
                    {loading ? "가입 중..." : "가입하기"}
                </Button>

                {/* 소셜 로그인 버튼 */}
                <Button type="submit" disabled={loading} className="mt-2">
                    {loading ? "소셜 로그인 중..." : "소셜 로그인 하기"}
                </Button>
            </div>
        </form>
    );
}
