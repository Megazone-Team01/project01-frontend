import React from "react";

import useProfileForm from "../hook/useProfileForm";
import ProfilePage from "../components/ProfilePage";

export default function Profile() {
    const profileForm = useProfileForm();

    return (
        <div className="my-profile-page max-w-5xl mx-auto mt-10 px-6">
            <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
            <ProfilePage {...profileForm} />
        </div>
    );
}