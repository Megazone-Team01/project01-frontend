import {Sidebar, SidebarHeader, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.js";
import AdminSidebar from "@/domains/admin/components/AdminSidebar.jsx";
import AdminBarChart from "@/domains/admin/components/AdminBarChart.jsx";
import AdminTodoBoard from "@/domains/admin/components/AdminTodoBoard.jsx";
import {useEffect, useState} from "react";
import {AdminOrganizationList} from "@/domains/admin/page/AdminOrganizationList.jsx";
import AdminUserList from "@/domains/admin/page/AdminUserList.jsx";
import AdminLectureList from "@/domains/admin/page/AdminLectureList.jsx";
import AdminUserCreatePage from "@/domains/admin/page/AdminUserCreatePage.jsx";
import AdminOrganizationCreatePage from "@/domains/admin/page/AdminOrganizationCreatePage.jsx";
import AdminLectureCreatePage from "@/domains/admin/page/AdminLectreCreatePage.jsx";
import AdminOrganizationJudgePage from "@/domains/admin/page/AdminOrganizationJudgePage.jsx";
import AdminLectureJudgePage from "@/domains/admin/page/AdminLectureJudgePage.jsx";
import AdminCategoryPage from "@/domains/admin/page/AdminCategoryPage.jsx";
import AdminDayPage from "@/domains/admin/page/AdminDayPage.jsx";
import {getWaitingOrganizations} from "@/domains/admin/api/organizationApi.js";
import {getJudgedLectures} from "@/domains/admin/api/lectureApi.js";


export const AdminMainPage = () => {
    const [ selected, setSelected ] = useState(0);

    const [ judgeOrganization, setJudgeOrganization ] = useState( [] );
    const [ judgeLecture, setJudgeLecture ] = useState( [] );
    const [ recentUser, setRecentUser ] = useState( [] );
    const [ recentLecture, setRecentLecture ] = useState( [] );

    useEffect(() => {
        const fetchData = async () => {
            // 승인 대기 기관
            const jOrg = await getWaitingOrganizations();
            // 승인 대기 강의
            const jLec = await getJudgedLectures()

            // 세팅
            setJudgeOrganization( jOrg )
            setJudgeLecture( jLec )
        }
        fetchData();
    }, []);

    return (
      <div className="">
          <SidebarProvider>
              <AdminSidebar onClick={setSelected} />
              <div className="flex flex-col w-full">
                  <div className="p-3">
                      <SidebarTrigger className="hover:cursor-pointer" />
                  </div>
                  {
                      selected === 0 ?
                          <div className="grid grid-cols-2 gap-2">
                              <AdminTodoBoard name={"승인 대기 기관"} data={judgeOrganization} />
                              <AdminTodoBoard name={"승인 대기 강의"} data={judgeLecture} />
                              <AdminTodoBoard name={"최근 가입한 사용자"} data={recentUser} />
                              <AdminTodoBoard name={"최근 추가된 강의"} data={recentLecture} />
                          </div>
                      : selected === 3 ?
                          <AdminOrganizationList />
                      : selected === 4 ?
                          <AdminOrganizationCreatePage />
                      : selected === 5 ?
                          <AdminOrganizationJudgePage />
                      : selected === 1 ?
                          <AdminUserList />
                      : selected === 2 ?
                          <AdminUserCreatePage />
                      : selected === 6 ?
                          <AdminLectureList />
                      : selected === 7 ?
                          <AdminLectureCreatePage />
                      : selected === 8 ?
                          <AdminLectureJudgePage />
                      : selected === 9 ?
                          <AdminCategoryPage />
                      : selected === 10 ?
                          <AdminDayPage />
                      : null
                  }
              </div>
          </SidebarProvider>
      </div>
    );
}

export default AdminMainPage;