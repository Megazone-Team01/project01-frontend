import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar.js";


export const AdminSidebar = ( { onClick } ) => {

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup className="pt-13">
                    <SidebarMenuButton className="hover:cursor-pointer" asChild>
                        <p onClick={ () => onClick(0) }>
                            Home
                        </p>
                    </SidebarMenuButton>
                    <SidebarGroupLabel> User </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(1)}>
                                        사용자 조회
                                    </p>
                                </SidebarMenuButton>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(2)}>
                                        사용자 추가
                                    </p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel> Organization </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(3)}>
                                        기관 조회
                                    </p>
                                </SidebarMenuButton>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(4)}>
                                        기관 생성
                                    </p>
                                </SidebarMenuButton>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(5)}>
                                        기관 심사
                                    </p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel> Lecture </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(6)}>
                                        강의 조회
                                    </p>
                                </SidebarMenuButton>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(7)}>
                                        강의 추가
                                    </p>
                                </SidebarMenuButton>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(8)}>
                                        강의 심사
                                    </p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel> Setting </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(9)}>
                                        카테고리
                                    </p>
                                </SidebarMenuButton>
                                <SidebarMenuButton className="hover:cursor-pointer" asChild>
                                    <p onClick={ () => onClick(10)}>
                                        요일
                                    </p>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AdminSidebar;