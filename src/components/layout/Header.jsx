import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/common/store/auth/authSlice";
import { Link , useNavigate } from "react-router";
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
    BellIcon, BookIcon,
    ComputerIcon,
    LogOutIcon,
    MessageCircleIcon,
    SettingsIcon,
    UserIcon
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

export default function Header({isLoggedIn,hasNotifications,hasMessages}) {

    const [isScrolled, setIsScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state) => state.auth ?? {});
    const [ isOnline, setOnline ] = useState(false);

    const [ userInfo, setUserInfo ] = useState({
        fileUrl: '',
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
            {isAuthenticated ?(
                <div className="flex item-center gap-2">
                    <Button size="icon" variant="ghost" asChild className="relative">
                        <Link to="/my/notifications">
                            <BellIcon className="size-4"/>
                            {hasNotifications && (
                                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"/>
                            )}
                        </Link>
                    </Button>
                    <Button size="icon" variant="ghost" asChild className="relative">
                        <Link to="/">
                            <MessageCircleIcon className="size-4"/>
                            {hasMessages && (
                                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"/>
                            )}
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage
                                    src={`${import.meta.env.VITE_FILE_URL_HEADER}${userInfo.fileUrl}`}
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
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup className="flex flex-col gap-1">
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to="/profile">
                                        <UserIcon className="size-4 mr-2"/>
                                        마이페이지
                                    </Link>
                                </DropdownMenuItem>
                                {
                                    user.role !== "STUDENT" ?
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to={
                                                user.role === "ADMIN " ? "/admin" : "/"
                                            }>
                                                <BookIcon className="size-4 mr-2"/>
                                                관리
                                            </Link>
                                        </DropdownMenuItem>
                                        :
                                        ""
                                }
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
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