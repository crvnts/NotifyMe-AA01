import React from 'react';
//import Navbar from './Navbar';
import './Dashboard.css';

function Dashboard() {
    /*
    useEffect( () => {
        $(window).on('load', function(){
            setTimeout(function() {
                $('.dash-body').fadeIn('slow');
            }, 750);
        });
        return () => {
            console.log("unmounted");
        };
    }, []);
    */

    return (
        <div className='background'>
            <div className="dash-body">
                <div className="dash-side-menu">
                    <div className="dash-container">
                        <div className="dash-smenu-text">NotifyMe</div>
                    </div>
                </div>
                <div className='widget-top-row'>
                    <div className="plan-trip-widget">
                        <div className="widget-text">Plan a Trip</div>
                    </div>
                    <div className="weather-widget">
                        <div className="widget-text">Headed out?</div>
                    </div>
                    <div className="ad-widget">
                        <div className="widget-text">Uber Eatz Ad</div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Dashboard;