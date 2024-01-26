import React, {useState} from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
    const [click, setClick] = useState(false);  //this will update the state

    const handleClick = () => setClick(!click);
    const closeSideMenu = () => setClick(false);
  return (
    <>
        <nav clasName="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    NotifyMe <i class="fab fa-typo3"></i>
                </Link>
                <div class='menu-icon' onClick={handleClick}>
                    <i className={click ? 'times' : 'bars'} />
                </div>
                <ul className={click ? 'nav-menu-active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/myAccount' className='nav-links' onClick={closeSideMenu}>
                            My Account
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/myTrips' className='nav-links' onClick={closeSideMenu}>
                            My Trips
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/planTrip' className='nav-links' onClick={closeSideMenu}>
                            Plan Trip
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/feedback' className='nav-links' onClick={closeSideMenu}>
                            Feedback
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    </>
  )
}

export default Navbar