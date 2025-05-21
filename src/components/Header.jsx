import logo from "../assets/logoCook.svg";

function Header() {
    return (
        <header>
            <img src={logo} alt="Logo" className="header-img" />
            <h1>Can I Cook It?</h1>
        </header>

    )
}

export default Header