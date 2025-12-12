
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/login";

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

                // 백엔드 GetLoginResponse가 있으면 로그인 성공
                if (result?.id) {
                    alert(`로그인 성공! 환영합니다, ${result.name}`);
                    navigate("/"); // 홈화면으로 이동
                } else {
                    setError("로그인에 실패했습니다.");
                }
            } catch (err) {
                // 서버에서 내려준 메시지가 있으면 표시
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

