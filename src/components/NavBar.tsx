import { NavLink } from "react-router-dom"

const NavBar = () => {
    return (
        <nav className="nav">
            <ul className="nav__list" role="list">
                <li>
                    <NavLink to='/' className={ ({isActive}) => isActive ? 'active-link' : undefined }>
                        Play
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/leaderboard' className={ ({isActive}) => isActive ? 'active-link' : undefined }>
                        Leaderboard
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar;
