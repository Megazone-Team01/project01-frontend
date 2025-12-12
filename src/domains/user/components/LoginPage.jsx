import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useLoginForm from "../hook/useLoginForm";

export default function LoginPage() {
    const {
        form,
        handleChange,
        handlePasswordChange,
        handleSubmit,
        loading,
        error,
        passwordError,
        showPassword,
        setShowPassword,
    } = useLoginForm();

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="flex flex-col gap-4">

                {/* 이메일 */}
                <div className="flex flex-col gap-1">
                    <div className="relative flex items-center">
                        <Label htmlFor="email">이메일</Label>
                    </div>

                    <Input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
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

                        {/* 눈 아이콘 */}
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

                    {/* 비밀번호 오류 */}
                    {passwordError && (
                        <div className="absolute left-full ml-1 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            {passwordError}
                        </div>
                    )}
                </div>

                {/* 로그인 버튼 */}
                <Button type="submit" disabled={loading} className="mt-2">
                    {loading ? "로그인 중..." : "로그인"}
                </Button>
            </div>
        </form>
    );
}
