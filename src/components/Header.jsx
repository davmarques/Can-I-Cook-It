import logo from "../assets/logo.svg";

function Header() {
    return (
        <header className="header h-25 flex justify-center items-center gap-4 bg-(--main-bg) shadow-md">
            <img src={logo} alt="Logo" className="h-12 -(--secondary-bg)" />
            <h1 className="text-3xl text-(--secondary-bg)">Can I Cook It?</h1>
        </header>

    )
}

export default Header