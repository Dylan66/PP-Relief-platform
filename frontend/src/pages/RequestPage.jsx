// frontend/src/pages/RequestPage.jsx
import React from 'react';
import './RequestPage.css'; // Import the CSS file
import Footer from '../components/common/Footer'; // Import the Footer component

function RequestPage() {
    return (
        <div className="request-page-container">
            {/* Navigation Bar */}
            

            {/* Why We Do It Section */}
            <section className="page-section light-pink-background">
                <h2 className="section-heading">WHY WE DO IT</h2>
                <p className="section-text">
                    Our mission is to raise awareness about menstrual health and
                    empower women with the knowledge and resources they need. We
                    envision a world where every woman has access to safe and hygienic
                    menstrual products.
                </p>
            </section>

            {/* How We Do It Section 1 */}
            <section className="page-section">
                <h2 className="section-heading">HOW WE DO IT</h2>
                <p className="section-text">
                    Our mission is to raise awareness about menstrual health and
                    empower women with the knowledge and resources they need. We
                    envision a world where every woman has access to safe and hygienic
                    menstrual products.
                </p>
            </section>

            {/* How We Do It Section 2 */}
            <section className="page-section light-pink-background">
                <h2 className="section-heading">HOW WE DO IT</h2>
                <p className="section-text">
                    Our mission is to raise awareness about menstrual health and
                    empower women with the knowledge and resources they need. We
                    envision a world where every woman has access to safe and hygienic
                    menstrual products.
                </p>
            </section>

            {/* How We Do It Section 3 */}
            <section className="page-section">
                <h2 className="section-heading">HOW WE DO IT</h2>
                <p className="section-text">
                    Our mission is to raise awareness about menstrual health and
                    empower women with the knowledge and resources they need. We
                    envision a world where every woman has access to safe and hygienic
                    menstrual products.
                </p>
            </section>

            {/* Buttons Section */}
            <section className="buttons-section">
                <button className="button-base register-button">Register</button>
                <button className="button-base donate-button">Donate</button>
            </section>

            <Footer /> {/* Use the new Footer component */}
        </div>
    );
}

export default RequestPage;