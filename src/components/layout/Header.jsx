
import {Link} from "react-router";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu.js";
import {cn} from "@/lib/utils.js";
import {Button} from "@/components/ui/button.js";
import {Separator} from "@/components/ui/separator.js";
import {BarChart3Icon, BellIcon, LogOutIcon, MessageCircleIcon, SettingsIcon, UserIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.js";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.js";
import {useEffect, useState} from "react";




const menus = [
    {
        name: "Onlone",
        to: "/online",
        items: [
            {
                name: "Leaderboards",
                description: "See the top performers in your community",
                to: "/products/leaderboards",
            },
            {
                name: "Categories",
                description: "See the top categories in your community",
                to: "/products/categories",
            },
            {
                name: "Search",
                description: "Search for a product",
                to: "/products/search",
            },
            {
                name: "Submit a Product",
                description: "Submit a product to our community",
                to: "/products/submit",
            },
            {
                name: "Promote",
                description: "Promote a product to our community",
                to: "/products/promote",
            },
        ],
    },
    {
        name: "Offline",
        to: "/Offline",
        items: [
            {
                name: "Remote Jobs",
                description: "Find a remote job in our community",
                to: "/jobs?location=remote",
            },
            {
                name: "Full-Time Jobs",
                description: "Find a full-time job in our community",
                to: "/jobs?type=full-time",
            },
            {
                name: "Freelance Jobs",
                description: "Find a freelance job in our community",
                to: "/jobs?type=freelance",
            },
            {
                name: "Internships",
                description: "Find an internship in our community",
                to: "/jobs?type=internship",
            },
            {
                name: "Submit a Job",
                description: "Submit a job to our community",
                to: "/jobs/submit",
            },
        ],
    },
    {
        name: "Academy",
        to: "/community",
        items: [
            {
                name: "All Posts",
                description: "See all posts in our community",
                to: "/community",
            },
            {
                name: "Top Posts",
                description: "See the top posts in our community",
                to: "/community?sort=top",
            },
            {
                name: "New Posts",
                description: "See the new posts in our community",
                to: "/community?sort=new",
            },
            {
                name: "Create a Post",
                description: "Create a post in our community",
                to: "/community/create",
            },
        ],
    }
];



export default function Header({isLoggedIn,hasNotifications,hasMessages}) {

    const [isScrolled, setIsScrolled] = useState(false);

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

    return (
        <nav
            className={cn([
                "flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                !isScrolled && "bg-blue-400",
                isScrolled && "bg-transparent"
            ])}
        >
            <div className="flex items-center">
                <Link to="/" className="font-bold tracking-tight text-lg">
                    Megazon Academy
                </Link>
                <Separator orientation="vertical" className="h-6 mx-4" />
                <NavigationMenu>
                    <NavigationMenuList>{menus.map((menu) =>(
                        <NavigationMenuItem key={menu.name}>
                            {menu.items ? <>
                                    <Link to={menu.to}>
                                        <NavigationMenuTrigger>
                                            {menu.name}
                                        </NavigationMenuTrigger>
                                    </Link>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[500px] font-light gap-3 p-4 grid-cols-2">
                                            {menu.items?.map((item) =>(
                                                <NavigationMenuItem key={item.name} className={cn([
                                                    "select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent",
                                                    item.to === "/products/promote" &&
                                                    "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                                                    item.to === "/jobs/submit" &&
                                                    "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                                                ])}>
                                                    <NavigationMenuLink>
                                                        <Link
                                                            className="p-3 space-y-1 block leading-none no-underline outline-none"
                                                            to={item.to}>
                                                            <span className="text-sm font-medium leading-none">{item.name}</span>
                                                            <p className="test-sm leading-snug text-muted-foreground">{item.description}</p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </NavigationMenuItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </>:
                                <Link className={navigationMenuTriggerStyle()} to={menu.to}>{menu.name}</Link>

                            }
                        </NavigationMenuItem>
                    ))}</NavigationMenuList>
                </NavigationMenu>
            </div>
            {!isLoggedIn ?(
                <div className="flex item-center gap-2">
                    <Button size="icon" variant="ghost" asChild className="relative">
                        <Link to="/my/notifications">
                            <BellIcon className="size-4" />
                            {hasNotifications && (
                                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
                            )}
                        </Link>
                    </Button>
                    <Button size="icon" variant="ghost" asChild className="relative">
                        <Link to="/my/messages">
                            <MessageCircleIcon className="size-4" />
                            {hasMessages && (
                                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
                            )}
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src="https://github.com/Anchangwan.png"/>
                                <AvatarFallback>
                                    N
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="flex flex-col gap-1">
                                <span className="font-medium">hello</span>
                                <span className="text-xs text-muted-foreground">
                    @username
                  </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup className="flex flex-col gap-1">
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to="/my/dashboard">
                                        <BarChart3Icon className="size-4 mr-2" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to="/my/profile">
                                        <UserIcon className="size-4 mr-2" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to="/my/settings">
                                        <SettingsIcon className="size-4 mr-2" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/auth/logout">
                                    <LogOutIcon className="size-4 mr-2" />
                                    Logout
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            ) : (
                <div className="flex item-center gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/auth/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/auth/join">Sign Up</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}