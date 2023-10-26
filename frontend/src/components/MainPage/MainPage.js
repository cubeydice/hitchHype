import './MainPage.css'
import roadtrip from '../../assets/images/dino-reichmuth-A5rCN8626Ck-unsplash.jpg'
import { NavLink } from 'react-router-dom'

function MainPage() {
    return (
        <div className='home-page'>
            <div className='header-container'>
                <h1 className='home-header'>Commute. Connect. Save.</h1>
                <p className='home-sub-header'>Join us in reducing traffic, lowering costs, and fostering new friendships on the road. 😊</p>
            </div>
            <div className='to-index'>
                    <NavLink className='to-index-button' to='/trips'>Check out our available trips</NavLink>
                </div>
            <div className='image-container'>
                <img className='roadtrip-image' src={roadtrip} alt=""></img>
                <div className='search-form'>
                <form>
                        <input 
                            type='text'
                            placeholder='From'
                        />
                        <input 
                            type='text'
                            placeholder='To'
                        />
                        <input type='date' />
                        <input type='submit' value='Search'/>
                    </form>
                </div>  
            </div>
            <div className='positive-container'>
                <div className='positive'>
                    <h2>Save on gas</h2>
                    <p>A cost-effective way to reduce your expenses on fuel and transportation.</p>
                </div>
                <div className='positive'>
                    <h2>Skip on driving</h2>
                    <p>Allows you to skip the stress of driving alone by sharing the ride with others.</p>
                </div>
                <div className='positive'>
                    <h2>Save the planet</h2>
                    <p>An environmentally-friendly choice that helps reduce the carbon footprint and lower emissions.</p>
                </div>
            </div>

        </div>
    );
}
/* <footer>
Copyright &copy; 2022 Chirper
</footer> */
export default MainPage;