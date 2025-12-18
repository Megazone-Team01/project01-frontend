import React from "react";

import useMyForm from "../hook/useMyForm";
import MyPage from "../components/MyPage";

export default function MyProfilePage() {
    const myForm = useMyForm();

    return (
        <div className="my-profile-page">
            <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
            <MyPage {...myForm} />
        </div>
    );
}