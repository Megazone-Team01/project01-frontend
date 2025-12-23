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
        <div className="w-full flex flex-col">
            {/* 헤더 바로 아래 여백 */}
            <div className="flex flex-col items-center">
                {/* 로그인 카드 */}
                <div className="flex w-full max-w-6xl h-[60vh] bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* 좌측 브랜드 */}
                    <div className="flex-1 bg-white flex flex-col justify-center items-left p-16">
                          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg
                                         bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary mb-4 md:mb-6
                                         [-webkit-text-stroke:0.25px_black]">
                            LinkEd
                          </h1>
                          <p className="text-xl md:text-2xl opacity-80 mb-4">
                              Learn. Connect. Grow.
                          </p>
                          <span className="block w-24 h-1 mt-3 rounded bg-primary self-start"></span>

                    </div>

                    {/* 우측 로그인 폼 */}
                    <div className="flex-1 flex flex-col justify-center p-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-8">로그인</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="이메일을 입력해 주세요"
                                className="bg-gray-100 placeholder-gray-400 text-gray-900 focus:ring-primary focus:border-primary transition-all duration-300"
                            />
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <Label htmlFor="password">비밀번호</Label>
                            <div className="relative">
                                <Input
                                      id="password"
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      value={form.password}
                                      onChange={handlePasswordChange}
                                      placeholder="비밀번호를 입력해 주세요"
                                      className="bg-gray-100 placeholder-gray-400 text-gray-900 pr-10 focus:ring-primary focus:border-primary transition-all duration-300"
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                                {passwordError && (
                                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-white text-black border border-black font-bold py-3 hover:scale-105 transform transition-all duration-300 shadow-lg"
                            >
                                {loading ? "로그인 중..." : "로그인"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
