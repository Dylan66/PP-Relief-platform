// frontend/src/pages/RequestPage.jsx
import React from 'react';
import './RequestPage.css'; // Import the CSS file

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

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p><strong>Address:</strong> Level 1, 12 Sample St, Sydney NSW 2000</p>
                    <div className="footer-contact">
                        <p><strong>Contact:</strong></p>
                        <p>info@relume.io</p>
                        <p>1800 123 4567</p>
                    </div>
                    <div className="footer-social-icons">
                        <span>[IG]</span>
                        <span>[FB]</span>
                        <span>[LN]</span>
                        <span>[YT]</span>
                        <span>[X]</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default RequestPage;