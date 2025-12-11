import { useState } from "react";
import { signup } from "../api/signup";

export default function useSignupForm() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
        phone: "",
        type: "ALL",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [phoneError, setPhoneError] = useState("");

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 전화번호 숫자만 허용
    const handlePhoneChange = (e) => {
        const input = e.target.value;
        const onlyNumbers = input.replace(/[^0-9]/g, "");
        if (input !== onlyNumbers) {
            setPhoneError("숫자만 입력 가능합니다.");
            setTimeout(() => setPhoneError(""), 1500);
        }
        setForm({ ...form, phone: onlyNumbers });
    };

    // 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.email || !form.password || !form.passwordConfirm || !form.name || !form.phone) {
            setError("모든 값을 입력해주세요.");
            setLoading(false);
            return;
        }

        if (form.password !== form.passwordConfirm) {
          setError("비밀번호가 일치하지 않습니다.");
          setLoading(false);
          return;
        }

        try {
            await signup(form);
            alert("회원가입 완료!");
            setForm({
                email: "",
                password: "",
                passwordConfirm: "",
                name: "",
                phone: "",
                type: "ALL",
            });
            setError(null);
        } catch {
            setError("회원가입 실패");
        } finally {
            setLoading(false);
        }
    };

    return { form, handleChange, handlePhoneChange, handleSubmit, loading, error, phoneError, setForm, setError };
}
