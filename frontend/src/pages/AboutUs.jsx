import React from 'react';
import styles from './AboutUs.module.css'; // Import the CSS module

const AboutUs = () => {
  return (
    // Increased vertical padding for overall spacing if needed
    <div className="container mx-auto px-4 py-12 md:py-16">

      {/* Hero Section: Text Left, Graphic Right */}
      {/* Added light lavender background (bg-violet-50 or similar) and padding */}
      <div className="flex flex-col md:flex-row items-center mb-16 md:mb-24 bg-violet-50 p-8 rounded-lg">
        {/* Text & Buttons Container (Left) */}
        {/* Adjusted width to md:w-3/5 for a roughly 40% width, pr for spacing */}
        <div className="md:w-3/5 text-left mb-8 md:mb-0 md:pr-8 lg:pr-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-gray-800">
            Empowering Women through Menstrual Health Awareness
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Our mission is to raise awareness about menstrual health and
            empower women with the knowledge and resources they need. We
            envision a world where every woman has access to safe and hygienic
            menstrual products.
          </p>
          <div className="flex space-x-4">
            <button className={styles.donateButton}>Donate</button>
            <button className={styles.registerButton}>Register</button>
          </div>
        </div>
        {/* Graphic Container (Right) */}
        <div className="md:w-2/5">
          <img src="/images/her-ubuntu.svg" alt="Her Ubuntu" className="w-full" />
        </div>
      </div>

      {/* Combined Mission/Vision/Values Section */}
      <div className="mb-16 md:mb-24 space-y-12"> {/* Add space between the two rows */}
        {/* Row 1: Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Our Mission:</h2>
            <p className="text-gray-700">
              To eradicate period poverty globally by ensuring access to
              menstrual products and empowering individuals with
              comprehensive and engaging menstrual health knowledge.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Our Vision:</h2>
            <p className="text-gray-700">
              A world where period poverty is eliminated, and all individuals,
              regardless of location or circumstance, can manage their
              menstruation with dignity, knowledge, and without limitation.
            </p>
          </div>
        </div>

        {/* Row 2: Values (Empowerment, Dignity, Compassion) */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12"> 
           <div> {/* Removed md:w-1/3, letting grid handle sizing */}
             <h2 className="text-2xl font-semibold mb-3 text-gray-800">Empowerment:</h2>
             <p className="text-gray-700">
               We believe in equipping people with the knowledge and resources
               to take control of their health and futures.
             </p>
           </div>
           <div>
             <h2 className="text-2xl font-semibold mb-3 text-gray-800">Dignity:</h2>
             <p className="text-gray-700">
               We champion the inherent worth and right to respect for every menstruating
               individual.
             </p>
           </div>
           <div>
             <h2 className="text-2xl font-semibold mb-3 text-gray-800">Compassion:</h2>
             <p className="text-gray-700">
               We approach our work with empathy and understanding for the
               diverse experiences of individuals around the world.
             </p>
           </div>
         </div>
       </div>


      {/* Articles Section (Remains Horizontal) */}
      <div className="mb-16 md:mb-24"> {/* Added bottom margin */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12"> {/* Increased gap */}
          {/* Article 1 */}
          <div className="p-4">
            <div className="bg-gray-200 h-48 mb-4 rounded"></div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">ARTICLE TITLE</h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
          {/* Article 2 */}
          <div className="p-4">
            <div className="bg-gray-200 h-48 mb-4 rounded"></div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">ARTICLE TITLE</h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
          {/* Article 3 */}
          <div className="p-4">
            <div className="bg-gray-200 h-48 mb-4 rounded"></div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">ARTICLE TITLE</h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat.
            </p>
          </div>
        </div>
      </div>

       {/* Footer Section */}
       {/* Adjusted text alignment and spacing */}
       <footer className="text-left text-sm text-gray-700 mt-12 py-8 border-t">
            <p className="mb-1"><strong>Address:</strong> Level 1, 12 Sample St, Sydney NSW 2000</p>
            <p className="mb-1"><strong>Contact:</strong> info@relume.io</p>
            <p className="mb-4">1800 123 4567</p>
            {/* Social Media Icons */}
            <div className="flex space-x-5"> {/* Increased spacing */} 
                {/* Replace spans with actual icons later */}
                <a href="#" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
            </div>
        </footer>

    </div>
  );
};

export default AboutUs; 