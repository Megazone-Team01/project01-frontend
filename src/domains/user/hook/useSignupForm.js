import { useState } from "react";
import { signup } from "../api/signup";
import { useNavigate } from "react-router";

export default function useSignupForm() {
    const [form, setForm] = useState({

        email: "",
        password: "",
        passwordConfirm: "",
        role: "STUDENT",
        name: "",
        phone: "",
        type: "ALL",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

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

            // 최소 8글자, 대문자, 소문자, 숫자, 특수문자 검사
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/;


            if (!updated.password || !updated.passwordConfirm) {
                setPasswordError("");
            } else if (!passwordRegex.test(updated.password)) {
                setPasswordError(
                    "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
                );
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

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

            if (!updated.password || !updated.passwordConfirm) {
                setPasswordConfirmError("");
            } else if (!passwordRegex.test(updated.passwordConfirm)) {
                setPasswordConfirmError(
                    "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
                );
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
        console.log("폼 제출 데이터:", form);

        if( emailError.length !== 0 || phoneError.length !== 0 || passwordError.length !== 0 || passwordConfirmError.length !== 0 ) {
            setError("올바르지 않은 입력 값이 있습니다.");
            setLoading(false);
            return;
        }

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
                role: "STUDENT",
                name: "",
                phone: "",
                type: "ALL",
            });
            setError(null);
            setPhoneError("");
            setEmailError("");
            setPasswordConfirmError("");

            navigate("/");
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
