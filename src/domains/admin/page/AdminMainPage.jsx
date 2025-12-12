import {Sidebar, SidebarHeader, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.js";
import AdminSidebar from "@/domains/admin/components/AdminSidebar.jsx";
import AdminBarChart from "@/domains/admin/components/AdminBarChart.jsx";
import AdminTodoBoard from "@/domains/admin/components/AdminTodoBoard.jsx";
import {useState} from "react";
import {AdminOrganizationList} from "@/domains/admin/page/AdminOrganizationList.jsx";


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
                      : null
                  }
              </div>
          </SidebarProvider>
      </div>
    );
}

export default AdminMainPage;