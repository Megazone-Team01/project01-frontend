import {Sidebar, SidebarHeader, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.js";
import AdminSidebar from "@/domains/admin/components/AdminSidebar.jsx";
import AdminBarChart from "@/domains/admin/components/AdminBarChart.jsx";
import AdminTodoBoard from "@/domains/admin/components/AdminTodoBoard.jsx";
import {useState} from "react";
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


export const AdminMainPage = () => {
    const [ selected, setSelected ] = useState(0);
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
                          <div className="grid grid-cols-3 gap-2">
                              <AdminTodoBoard />
                              <AdminTodoBoard />
                              <AdminTodoBoard />
                              <AdminTodoBoard />
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