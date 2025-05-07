// frontend/src/pages/RequestPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './RequestPage.css'; // Import the CSS file
import Footer from '../components/common/Footer'; // Import the Footer component
import whoWeDoItForImage from '../assets/images/who_we_do_it_for.jpeg'; // Import the image
import whereWeDoItImage from '../assets/images/where_we_do_it.jpeg'; // Import new image
import whenWeDoItImage from '../assets/images/when_we_do_it.jpeg';   // Import new image
import howWeDoItImage from '../assets/images/how_we_do_it.jpeg';     // Import new image

function RequestPage() {
    const navigate = useNavigate(); // Initialize navigate

    const handleRegisterClick = () => {
        navigate('/register'); // Navigate to the register page
    };

    const handleDonateClick = () => {
        navigate('/donations'); // Navigate to the donations page
    };

    return (
        <div className="request-page-container">
            {/* Navigation Bar */}
            

            {/* Why We Do It Section */}
            <section className="page-section light-pink-background">
                <h2 className="section-heading">WHO WE DO IT FOR</h2>
                <div className="image-text-container"> {/* Updated container class */}
                    <img src={whoWeDoItForImage} alt="Diverse hands protecting a person" className="info-image" />
                    <p className="section-text">
                    Our work directly supports individuals who menstruate primarily women and girls,
                    who lack access to essential menstrual products and reliable health information. 
                    We focus particularly on those in low-income communities, schools, and underserved areas, 
                    aiming to remove barriers that prevent them from participating fully in life.
                    </p>
                </div>
            </section>

            {/* How We Do It Section 1 */}
            <section className="page-section">
                <h2 className="section-heading">WHERE WE DO IT</h2>
                <div className="image-text-container"> {/* Added container for flex layout */}
                    <img src={whereWeDoItImage} alt="Map or location representing where the work is done" className="info-image" />
                    <p className="section-text">
                    Our impact is felt across the country through a network of dedicated distribution centers and local partnerships. 
                    These centers serve as vital hubs, allowing us to efficiently get menstrual products 
                    and educational materials to communities in Kenya, reaching individuals directly where the need is greatest, 
                    from urban centers to remote regions.
                    </p>
                </div>
            </section>

            {/* How We Do It Section 2 */}
            <section className="page-section light-pink-background">
                <h2 className="section-heading">WHEN WE DO IT</h2>
                <div className="image-text-container"> {/* Added container for flex layout */}
                    <img src={whenWeDoItImage} alt="Calendar or clock representing the timing of initiatives" className="info-image" />
                    <p className="section-text">
                    The need for menstrual dignity and health information is constant, 
                    which is why our work is ongoing. We distribute products and conduct educational initiatives regularly, 
                    often aligned with school calendars and community needs. 
                    Our online resources are available 24/7, 
                    ensuring that vital information is accessible whenever someone needs it.
                    </p>
                </div>
            </section>

            {/* How We Do It Section 3 */}
            <section className="page-section">
                <h2 className="section-heading">HOW WE DO IT</h2>
                <div className="image-text-container"> {/* Added container for flex layout */}
                    <img src={howWeDoItImage} alt="Illustration of the process or method" className="info-image how-we-do-it-image" />
                    <p className="section-text">
                        Our mission is to raise awareness about menstrual health and
                        empower women with the knowledge and resources they need. We
                        envision a world where every woman has access to safe and hygienic
                        menstrual products.
                    </p>
                </div>
            </section>

            {/* Buttons Section */}
            <section className="buttons-section">
                <button className="button-base register-button" onClick={handleRegisterClick}>Register</button>
                <button className="button-base donate-button" onClick={handleDonateClick}>donations</button>
            </section>

            <Footer /> {/* Use the new Footer component */}
        </div>
    );
}

export default RequestPage;