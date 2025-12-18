import { Button } from "@/components/ui/button";
import { useApproveOrganizationForm } from "../hook/useApproveOrganizationForm";

export default function ApproveOrganizationPage() {
    const { pendingRequests, loading, error, handleUpdateStatus } = useApproveOrganizationForm();

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded flex justify-center">
{/*         <h2 className="text-xl font-semibold mb-4">가입 요청 승인</h2> */}

{/*          {loading && <p>로딩중...</p>} */}
{/*          {error && <p className="text-red-500 mb-2">{error}</p>} */}

        {pendingRequests.length === 0 && !loading ? (
            <p className="text-gray-500">승인 대기 요청이 없습니다.</p>
        ) : (
            <table className="w-full table-fixed border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 w-[150px] text-left whitespace-nowrap">강사 이름</th>
                        <th className="px-4 py-2 w-[250px] text-left whitespace-nowrap">이메일</th>
                        <th className="px-4 py-2 w-[150px] text-left whitespace-nowrap">폰번호</th>
                        <th className="px-4 py-2 w-[80px] text-center whitespace-nowrap">승인</th>
                        <th className="px-4 py-2 w-[80px] text-center whitespace-nowrap">거절</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{req.name}</td>
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
