import { NavLink } from 'react-router-dom'
import './MainPage.css'
import roadtrip from '../../assets/images/dino-reichmuth-A5rCN8626Ck-unsplash.jpg'
import ecoImg from '../../assets/images/avenue-2215317_640.jpg'
import gasImg from '../../assets/images/vendo-2589131_640.jpg'
import carSharing from '../../assets/icons/car-sharing.png'
import piggyBank from '../../assets/icons/piggy-bank.png'
import planetEarth from '../../assets/icons/planet-earth.png'
import { Link } from 'react-router-dom/cjs/react-router-dom';

function MainPage() {
    return (
        <div className='splash-container'>
        <div className='home-page'>
            <div className='header-container'>
                <h1 className='home-header'>Commute. Connect. Save.</h1>
                <p className='home-sub-header'>Join us in reducing traffic, lowering costs, and fostering new friendships on the road. 😊</p>
            </div>
            <div className='to-index'>
                    <NavLink className='to-index-button' to='/trips'>Check out our available trips</NavLink>
                </div>
            <div className='image-container'>
                <img className='roadtrip-image' src={roadtrip} alt="road-trip"></img>
                <div className='search-form'>
                <form>
                        <input
                            type='text'
                            placeholder='From'
                        />
                        <input
                            type='text'
                            placeholder='To (Optional)'
                        />
                        <input type='date' />
                        <input type='submit' value='Search'/>
                    </form>
                </div>
            </div>
            <div className='positive-container'>
                <div className='positive-note'>
                    <img className='piggy-icon' src={piggyBank} alt='save-gas'/>
                    <h2>Save on gas</h2>
                    <p>A cost-effective way to reduce your expenses on fuel and transportation.</p>
                </div>
                <div className='positive-note'>
                    <img className='car-icon' src={carSharing} alt='skip-driving'/>
                    <h2>Skip on driving</h2>
                    <p>Allows you to skip the stress of driving alone by sharing the ride with others.</p>
                </div>
                <div className='positive-note'>
                    <img className='planet-icon' src={planetEarth} alt='save-planet'/>
                    <h2>Save the planet</h2>
                    <p>An environmentally-friendly choice that helps reduce the carbon footprint and lower emissions.</p>
                </div>
            </div>
            <div className='positive-source-container'>
                <div className='positive-source'>
                    <Link to={`/save-money`}>
                        <img className='source-image' src={gasImg} alt='gas-prices'/>
                    </Link>
                    <span className='source-text'>Rising gas prices & inflation</span>
                </div>
                <div className='positive-source'>
                    <Link to={`/environment`}>
                        <img className='source-image' src={ecoImg} alt='environment'/>
                    </Link>
                    <span className='source-text'>Sustainable travel, economic benefits.</span>
                </div>
            </div>
        </div>
        </div>
    );
}
/* <footer>
Copyright &copy; 2022 Chirper
</footer> */
export default MainPage;