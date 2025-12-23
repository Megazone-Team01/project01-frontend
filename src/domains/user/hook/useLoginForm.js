import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../api/login";
import { loginSuccess } from "@/auth";

export default function useLoginForm() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    // 입력에 대한 처리
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // 로그인 후 홈 화면으로 이동
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setForm({ ...form, password: value });
        setPasswordError("");

        if (!value.trim()) {
            setPasswordError("비밀번호를 입력하세요");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email.trim()) {
            setError("이메일을 입력하세요");
            return;
        }

        if (!form.password.trim()) {
            setPasswordError("비밀번호를 입력하세요");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await login(form);

            if (result?.accessToken) {
                // localStorage 저장 (새로고침 대비)
                localStorage.setItem("accessToken", result.accessToken);

                // Redux 상태 저장
                dispatch(
                    loginSuccess({
                        user: {
                            id: result.id,
                            name: result.name,
                            email: result.email,
                            role: result.role,
                            type: result.type,
                        },
                        accessToken: result.accessToken,
                    })
                );
                // RefreshToken 저장
                localStorage.setItem("refreshToken", result.refreshToken);

                alert(`로그인 성공! 환영합니다, ${result.name}`);

                console.log("로그인 성공! 액세스토큰:", result.accessToken);
                console.log("유저 정보:", { id: result.id, email: result.email, name: result.name, role: result.role, type: result.type});

                navigate("/");

            } else {
                setError("로그인에 실패했습니다.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        handleChange,
        handlePasswordChange,
        handleSubmit,
        loading,
        error,
        passwordError,
        showPassword,
        setShowPassword,
        setForm,
        setError,
    };
}

