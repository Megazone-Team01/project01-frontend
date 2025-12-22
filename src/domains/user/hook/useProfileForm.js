import { useState, useEffect } from "react";
import { getMyInfo, updateMyInfo } from "../api/profile";
import {useDispatch} from "react-redux";

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



    const fetchMyInfo = async () => {
        setLoading(true);
        try {
            const data = await getMyInfo();
            setUserInfo(prev => ({ ...prev, ...data }));
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
    const openDaumPostcode = () => {
        if (!window.daum) {
            console.error("Daum Postcode script not loaded.");
            return;
        }

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
    };
}
