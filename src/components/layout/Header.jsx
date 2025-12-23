import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/common/store/auth/authSlice";
import { Link, useNavigate } from "react-router";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu.js";
import {cn} from "@/lib/utils.js";
import {Button} from "@/components/ui/button.js";
import {Separator} from "@/components/ui/separator.js";
import {
    BarChart3Icon,
    BellIcon, BellOffIcon, BookIcon,
    LogOutIcon,
    UserIcon,
    FilePlus
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.js";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.js";
import {useEffect, useState} from "react";
import {Item} from "@/components/ui/item.js";
import {Toggle} from "@/components/ui/toggle.js";
import {getProfileInfo} from "@/domains/user/api/profile.js";
import {useSSE} from "@/routes/SSEContext.jsx";

export default function Header({  hasNotifications }) {

    const [isScrolled, setIsScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { notifications } = useSSE();

    const { isAuthenticated, user } = useSelector((state) => state.auth ?? {});
    const [ isOnline, setOnline ] = useState(false);

    const [ userInfo, setUserInfo ] = useState({
        fileUrl: null,
        name: ''
    });

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if( user !== null ){
                const data = await getProfileInfo( user.id );
                console.log("getProfileInfo!!", data);
                setUserInfo(data);
            }
            else {
                setUserInfo( {
                    fileUrl: '',
                    name: ''
                })
            }
        }
        fetchData();
    }, [ isAuthenticated ]);

    // 로그아웃
    const handleLogout = () => {
        dispatch(logout()); // Redux 상태 초기화 + localStorage 제거
        navigate("/");      // 홈으로 이동
    };

    console.log( user )
    return (
        <nav
            className={cn([
                "flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                !isScrolled && "bg-blue-400",
                isScrolled && "bg-transparent"
            ])}
        >
            <div className="flex items-center">
                <Link to="/" className="font-bold tracking-tight text-2xl text-white">
                    LinkEd
                </Link>
                <Separator orientation="vertical" className="h-6 mx-4" />
                <Item
                    onClick={ isOnline ? () => navigate("/organizations") : () => navigate("/organizations") }
                    className="text-white hover:font-bold hover:cursor-pointer"> 아카데미 </Item>
                <Item
                    onClick={ isOnline ? () => navigate("/lecture/online") : () => navigate("/lecture/offline") }
                    className="text-white hover:font-bold hover:cursor-pointer"> 강의 </Item>
            </div>
            {isAuthenticated ? (
                <div className="flex item-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="relative">
                                {user.roleName !== "TEACHER" ? (
                                    <>
                                        <FilePlus className="size-5" />
                                        {hasNotifications && (
                                            <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
                                        )}
                                    </>
                                ) : null}
                            </Button>
                        </DropdownMenuTrigger>

                        {user.roleName !== "TEACHER" && (
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link to="/upload/offline" className="cursor-pointer">
                                        오프라인 강의 업로드
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/upload/online" className="cursor-pointer">
                                        온라인 강의 업로드
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        )}
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="relative flex justify-center items-center hover:cursor-pointer px-3">
                                <BellIcon size={20} />
                                {
                                    notifications.length > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-semibold rounded-full px-1">
                                        {notifications.length}
                                    </span>
                                    )
                                }
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="rounded-none min-w-[250px] bg-white p-0">
                            {
                                notifications.length > 0 ? (
                                    notifications.map((noti, index) => (
                                        <div>
                                            <DropdownMenuItem
                                                key={index + "_N"}
                                                className="rounded-none data-[highlighted]:text-black data-[state=open]:text-black
                                                data-[highlighted]:bg-yellow-200 data-[state=open]:bg-yellow-200 hover:bg-yellow-200 active:bg-yellow-200 active:text-black hover:cursor-pointer bg-yellow-100 min-h-[60px]">
                                                <DropdownMenuLabel> { noti.message } </DropdownMenuLabel>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="my-0" />
                                        </div>
                                    ))
                                )
                                :
                                    <DropdownMenuItem
                                        className="rounded-none bg-white disabled p-3">
                                        <DropdownMenuLabel className="flex justify-center items-center gap-3">
                                            <BellOffIcon />
                                            새로운 알림이 없습니다
                                        </DropdownMenuLabel>
                                    </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <AvatarImage
                                src={
                                    userInfo?.fileUrl
                                        ? `${import.meta.env.VITE_FILE_URL_HEADER}${userInfo.fileUrl}`
                                        : undefined
                                }
                                onError={(e) => {
                                    e.target.style.display = 'none'; // 에러나면 이미지 숨김
                                }}
                            />
                                <AvatarFallback>
                                    <UserIcon className="text-gray-400" />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="flex flex-col gap-1">
                                <span className="font-medium">
                                    { userInfo.name }
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {user.role === "ADMIN" ? "관리자" : user.role === "TEACHER" ? "강사" : "학생" }
                                  </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup className="flex flex-col gap-1">
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (user?.role === 'TEACHER') {
                                            navigate('/teacher/dashboard');
                                        }
                                        else if( user?.role === "ADMIN") {
                                            navigate('/admin')
                                        }
                                        else if( user?.role === "STUDENT") {
                                            navigate('/reservations/my');
                                        }
                                    }}
                                >
                                    <BarChart3Icon className="size-4 mr-2" />
                                    대시보드
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to="/profile">
                                        <UserIcon className="size-4 mr-2"/>
                                        마이페이지
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                                <LogOutIcon className="size-4 mr-2"/>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex justify-end items-center">
                        <Toggle variant="outline" pressed={isOnline} onPressedChange={setOnline} asChild>
                            <div
                                className="
                                hover:cursor-pointer hover:bg-transparent
                                border-white text-white
                                hover:text-white
                                hover:font-bold
                                data-[state=on]:font-bold
                                data-[state=on]:bg-white
                                data-[state=on]:text-red-500
                                ">
                                <span className="text-xs">{ isOnline ? "ON" : "OFF"} </span>
                            </div>
                        </Toggle>
                    </div>
                </div>

            ) : (
                <div className="flex item-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/sign">Sign Up</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}