import {Link} from "react-router";

function Header() {
    return (
        <header className="flex items-center justify-between bg-blue-400 px-15 py-10">
            <nav className="flex items-center justify-between gap-2">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </nav>
            <nav >
                <ul className="flex items-center justify-between gap-2">
                    <li>profile</li>
                    <li>LogIn</li>
                    <li>Join</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;