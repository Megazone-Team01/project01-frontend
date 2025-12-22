import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProfileInfo, updateProfileInfo, deleteProfileAccount } from "../api/profile";
import {fileUpload} from "@/common/api/fileApi.js";
import axios from "axios";

export default function useProfileForm() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        addressCode: "",
        address: "",
        addressDetail: "",
        email: "",
        phone: "",
        roleName: "",
        type: "",
        profileImage: "",
        lectures: [],
        organizations: [],
        fileId: '',
    });
    const { user, accessToken } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [addressSearchResults, setAddressSearchResults] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileUrl, setFileUrl] = useState(null); // 서버 URL
    const fileId = userInfo.fileId;

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    // 핸드폰 번호 형식
    const formatPhoneNumber = (number) => {
        if (!number) return "";
        const cleaned = number.replace(/\D/g, "");
        if (cleaned.length < 4) return cleaned;
        if (cleaned.length < 7) return cleaned.replace(/(\d{3})(\d+)/, "$1-$2");
        return cleaned.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    };

    // 마이페이지 조회
    const fetchProfileInfo = async () => {
        setLoading(true);
        try {
            const data = await getProfileInfo();
            console.log("fetch 후 userInfo:", data);
            // 조회 시점에 전화번호 포맷 적용
            const formattedPhone = formatPhoneNumber(data.phone || "");
            setUserInfo(prev => ({ ...prev, ...data, phone: formattedPhone }));
            setFileUrl(data.fileUrl || null);
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
            addressCode: selected.zipcode
        }));
        setAddressSearchResults([]);
    };

    // Daum 우편번호 팝업으로 주소 검색
    const openDaumPostcode = async () => {
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

        new window.daum.Postcode({
            oncomplete: function(data) {
              console.log(data); // 선택한 주소 정보
              // 예: 상태 업데이트
              setUserInfo(prev => ({
                ...prev,
                address: data.roadAddress,
                addressCode: data.zonecode,
              }));
            }
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

    // 수정, 저장 버튼
    const handleEditToggle = async () => {
        if (isEditing) {
            // 저장
            setLoading(true);
            try {
                console.log("ㅎㅎ",userInfo);
                await updateProfileInfo(userInfo);
                alert("정보가 저장되었습니다.");
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        setIsEditing(!isEditing);
    };

    // 탈퇴 버튼
    const handleDeleteAccount = async () => {
        console.log("탈퇴 버튼 클릭됨"); // <- 이 로그가 나오는지 확인
        if (!window.confirm("정말로 탈퇴하시겠습니까?")) return;

        setLoading(true);
        try {
            await deleteProfileAccount(); // API 함수 필요
            alert("회원 탈퇴가 완료되었습니다.");
            // 로그아웃 또는 페이지 이동
        } catch (err) {
            console.error(err);
            alert("탈퇴 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };


    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // 선택 즉시 미리보기
        setPreviewUrl(URL.createObjectURL(selectedFile));

        try {

            const data = await fileUpload(selectedFile);

            setUserInfo((prev) => ({
                ...prev,
                fileId: data.fileId,
                fileUrl: data.fileUrl,
            }));

            console.log("업로드 성공!", data);
        } catch (err) {
            console.error("파일 업로드 실패:", err);
            alert("파일 업로드 실패: " + err.message);
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
        handleFileChange,
        previewUrl,
        fileUrl,
        fileId,
        handleDeleteAccount
    };
}
