// src/pages/ContactPage.jsx
import React from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

import "../styles/contactPage.css"; 

function ContactPage() {
  return (
    <>
      <NavigationBar />

      <main className="contact-page-content">
        
        {/* Logo Section */}
        <div className="logo-2">
          <img className="img" src="/img/zeus-volunteer-logo-1-2.png" alt="Zeus Logo" />
          <div className="text-wrapper-4">Zeus Volunteers</div>
        </div>

        {/* --- FIXED SECTION BELOW --- */}
        
        {/* This "text-container" is the ONE CONTAINER holding everything */}
        <div className="text-container">
          
          {/* 1. The Title (Keep separate so it stays bold/large) */}
          <div className="header-container">
            <div className="header">Contact Support Information</div>
          </div>
          
          {/* 2. The Details (Sibling to header, but inside the same wrapper) */}
          <div className="contact-details">
              Phone number: 707-999-9999
              <br />
              Email: ZeusSupport@ZeusVolunteers.com
              <br />
              <br />
              When emailing support please provide details of your problem like 
              time of day when problem started, picture and written detail of 
              what the problem looks like, and any additional details of your issue.
          </div>

        </div>
        {/* --- END FIXED SECTION --- */}

      </main>

      <Footer />
    </>
  );
}

export default ContactPage;