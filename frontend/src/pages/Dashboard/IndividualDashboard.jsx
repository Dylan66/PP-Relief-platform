// src/pages/Dashboard/IndividualDashboard.jsx
import React from 'react';
import RequestFormIndividual from '../../components/Dashboard/Individual/RequestFormIndividual'; // Create this next
// Import component to display past requests later
// import RequestHistory from '../../components/Dashboard/Individual/RequestHistory';

const IndividualDashboard = () => {
  return (
    <div>
      <h2>Individual Dashboard</h2>
      <p>Welcome! Use the form below to request menstrual products.</p>

      <RequestFormIndividual />

      <hr style={{ margin: '2rem 0' }}/>

      {/* <RequestHistory /> */} {/* Add later */}

      <section>
        <h3>Menstrual Health Education</h3>
        <p>Understanding your body is empowering. Menstruation is a natural process, but various factors can affect your cycle...</p>
        {/* Add more educational snippets */}
        <p>Find more detailed information and resources on our <a href="/#education">Home Page Education Section</a> or the main site.</p>
        {/* Link to FAQs, Gynaecologist Directory if those pages exist */}
      </section>
    </div>
  );
};

export default IndividualDashboard;