import { Button } from "@/components/ui/button";
import { useApproveOrganizationForm } from "../hook/useApproveOrganizationForm";

export default function ApproveOrganizationPage() {
    const { pendingRequests, loading, error, handleUpdateStatus } = useApproveOrganizationForm();

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded flex justify-center">

        {pendingRequests.length === 0 && !loading ? (
            <p className="text-gray-500">승인 대기 요청이 없습니다.</p>
        ) : (
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">가입 요청 기관</th>
                        <th className="px-4 py-2 text-left">요청자</th>
                        <th className="px-4 py-2 text-left">역할</th>
                        <th className="px-4 py-2 text-left">이메일</th>
                        <th className="px-4 py-2 text-left">연락처</th>
                        <th className="px-4 py-2 text-center w-[60px]">조치</th>
                        <th className="px-4 py-2 text-center w-[60px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {pendingRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{req.organizationName}</td>
                            <td className="px-4 py-2">{req.name}</td>
                            <td className="px-4 py-2">{req.role === "STUDENT" ? "학생" :
                                                         req.role === "TEACHER" ? "강사" :
                                                         "알 수 없음"}</td>
                            <td className="px-4 py-2">{req.email}</td>
                            <td className="px-4 py-2">{req.phone}</td>
                            <td className="px-4 py-2 text-center">
                                <Button size="sm" onClick={() => handleUpdateStatus(req.id, 1)}>
                                    승인
                                </Button>
                            </td>
                            <td className="px-4 py-2 text-center">
                                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(req.id, -1)}>
                                    거절
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
        </div>
    );
}
