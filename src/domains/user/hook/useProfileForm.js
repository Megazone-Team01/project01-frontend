import { useState, useEffect } from "react";
import { getMyInfo, updateMyInfo } from "../api/profile";

export default function useMyForm() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        addressCode: "",
        addressDetail: "",
        email: "",
        phone: "",
        roleName: "",
        type: "",
        profileImg: "",
    });

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [addressSearchResults, setAddressSearchResults] = useState([]);

    useEffect(() => {
        fetchMyInfo();
    }, []);

    const formatPhoneNumber = (number) => {
        if (!number) return "";
        const cleaned = number.replace(/\D/g, "");
        if (cleaned.length < 4) return cleaned;
        if (cleaned.length < 7) return cleaned.replace(/(\d{3})(\d+)/, "$1-$2");
        return cleaned.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    };

    const fetchMyInfo = async () => {
        setLoading(true);
        try {
            const data = await getMyInfo();

            // 조회 시점에 전화번호 포맷 적용
            const formattedPhone = formatPhoneNumber(data.phone || "");
            setUserInfo(prev => ({ ...prev, ...data, phone: formattedPhone }));
            console.log("fetch 후 userInfo:", data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    // 기존 입력창으로 주소 검색
    const handleAddressChange = async (value) => {
        setUserInfo(prev => ({ ...prev, address: value }));

        if (value.length < 2) {
            setAddressSearchResults([]);
            return;
        }

        try {
            const res = await getZipcode(value);
            if (res?.results) {
                setAddressSearchResults(res.results);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectAddress = (selected) => {
        setUserInfo(prev => ({
            ...prev,
            address: selected.address,
            zipcode: selected.zipcode
        }));
        setAddressSearchResults([]);
    };

    // Daum 우편번호 팝업으로 주소 검색
    const openDaumPostcode = async () => {
        // 1. 스크립트가 없으면 동적으로 로드
        if (!window.daum) {
            const script = document.createElement("script");
            script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            document.body.appendChild(script);
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
        }

        // 2. 로드 완료 후 우편번호 팝업 열기
        new window.daum.Postcode({
            oncomplete: function (data) {
                setUserInfo(prev => ({
                    ...prev,
                    address: data.address,
                    zipcode: data.zonecode,
                }));
                setAddressSearchResults([]);
            },
        }).open();
    };

    // 전화번호
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        let formatted = value;
        if (value.length < 4) formatted = value;
        else if (value.length < 7) formatted = value.replace(/(\d{3})(\d+)/, "$1-$2");
        else formatted = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");

        setUserInfo(prev => ({ ...prev, phone: formatted }));
    };

    const handleEditToggle = async () => {
        if (isEditing) {
            // 저장
            setLoading(true);
            try {
                await updateMyInfo(userInfo);
                alert("정보가 저장되었습니다.");
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("정말로 탈퇴하시겠습니까?")) return;

        setLoading(true);
        try {
            await deleteMyAccount(); // API 함수 필요
            alert("회원 탈퇴가 완료되었습니다.");
            // 로그아웃 또는 페이지 이동
        } catch (err) {
            console.error(err);
            alert("탈퇴 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return {
        userInfo,
        setUserInfo,
        handleChange,
        handleAddressChange,
        handleSelectAddress,
        addressSearchResults,
        openDaumPostcode,
        handleEditToggle,
        isEditing,
        loading,
        showPassword,
        setShowPassword,
        showPasswordConfirm,
        setShowPasswordConfirm,
        handlePhoneChange,
    };
}
