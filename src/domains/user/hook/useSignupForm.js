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

    // 입력에 대한 처리
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");

    // 비밀번호 표시
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 이메일 유효성 검사
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setForm(prev => ({ ...prev, email }));

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !regex.test(email)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
        } else {
            setEmailError("");
        }
    };

    // 비밀번호 유효성 검사
    const handlePasswordChange = (e) => {
        const password = e.target.value;

        setForm((prev) => {
            const updated = { ...prev, password };

            if (!updated.password || !updated.passwordConfirm) {
                // 입력값을 클리어하면 메시지 없애기
                setPasswordError("");
            } else if (updated.password !== updated.passwordConfirm) {
                setPasswordError("비밀번호가 일치하지 않습니다.");
            } else {
                setPasswordError("");
                setPasswordConfirmError("");
            }

            return updated;
        });
    };

    // 비밀번호 확인 유효성 검사
    const handlePasswordConfirmChange = (e) => {
        const passwordConfirm = e.target.value;

        setForm((prev) => {
            const updated = { ...prev, passwordConfirm };

            if (!updated.password || !updated.passwordConfirm) {
                setPasswordConfirmError("");
            } else if (updated.password !== updated.passwordConfirm) {
                setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
            } else {
                setPasswordError("");
                setPasswordConfirmError("");
            }

            return updated;
        });
    };



    // 전화번호 유효성 검사
    const handlePhoneChange = (e) => {
        const input = e.target.value;
        const onlyNumbers = input.replace(/[^0-9]/g, "");
        if (input !== onlyNumbers) {
            setPhoneError("숫자만 입력 가능합니다.");
            setTimeout(() => setPhoneError(""), 1500);
        } else if (onlyNumbers.length > 11) {
            setPhoneError("전화번호는 11자리 이하입니다.");
        } else {
            setPhoneError("");
        }
        setForm((prev) => ({ ...prev, phone: onlyNumbers }));
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
            setPhoneError("");
            setEmailError("");
            setPasswordConfirmError("");
        } catch {
            setError("회원가입 실패");
        } finally {
            setLoading(false);
        }
    };

    return { form, handleChange, handlePhoneChange, handleEmailChange, handlePasswordChange, handlePasswordConfirmChange,
            handleSubmit, loading, error, phoneError, emailError, passwordError, passwordConfirmError,
            showPassword, setShowPassword, showPasswordConfirm, setShowPasswordConfirm,setForm, setError };
}
