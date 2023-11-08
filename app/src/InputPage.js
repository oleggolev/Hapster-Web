import React, { useState } from 'react';
import { FaStopCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const InputPage = (props) => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(true);

  // Function to handle user agreement
  const handleAgree = () => {
    setShowConsentModal(false); // Close the consent modal
    // Additional actions, if needed, before allowing access
  };

  // Function to handle entering the session after consent
  const handleEnterClick = async () => {
    if (!showConsentModal) {
      const sessionData = await getSessionData();
      if (sessionData && sessionData.status === 'success') {
        navigate(`/${sessionId}`);
      } else {
        setShowPopup(true);
        setSessionId('');
        setTimeout(() => {
          setShowPopup(false);
        }, 2000);
      }
    } else {
      // If the consent is not agreed, do not proceed
      alert('Please agree to the terms before proceeding.');
    }
  };

  // New function to fetch session data
  const getSessionData = async () => {
    try {
      const response = await fetch(
        `${props.serverurl}/get-session-data/${sessionId}`
      );
      console.log('hi');
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching session data:', error);
      return null;
    }
  };

  const gradientBackground = {
    // Style for the gradient background
    background: 'linear-gradient(to bottom, #3498db, #e74c3c, #f1c40f)', // Define your gradient colors here
  };

  const isMobile = window.innerWidth <= 768; // Set the width condition as per your design

  return (
    <div>
      <Modal
        isOpen={showConsentModal}
        onRequestClose={() => setShowConsentModal(false)}
        contentLabel="Consent Modal"
        shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        shouldCloseOnEsc={false} // Prevent closing on pressing Esc key
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Update the overlay as needed
          },
          content: {
            margin: isMobile ? '0' : '80px',
            paddingLeft: isMobile ? '30px' : '120px',
            paddingRight: isMobile ? '30px' : '120px',
            paddingTop: '50px', // Increase padding
            paddingBottom: '50px', // Increase padding
            fontSize: isMobile ? '10px' : '16px',
          },
        }}
      >
        <center>
          <img
            className="princeton"
            src="./princeton_logo.png" // Replace with the actual path/URL of the logo
            style={{ width: isMobile ? '200px' : '300px' }} // Adjust width and spacing as needed
          />{' '}
        </center>
        <h2>Adult Consent Form</h2>
        <p>
          TITLE OF RESEARCH:{' '}
          <strong>
            Study on how well does just-in-time, low-friction feedback solve the
            problem of delayed reactions by instructors
          </strong>
        </p>
        <p>
          PRINCIPAL INVESTIGATOR: <strong>Andrés Monroy-Hernández</strong>
        </p>
        <p>
          DEPARTMENT: <strong>Computer Science</strong>
        </p>
        <hr style={{ visibility: 'hidden' }} />
        <p>
          <u>
            <strong>Key information about the study</strong>
          </u>
        </p>
        <p>
          Your informed consent is being sought for research. Participation in
          the research is voluntary, and your participation will have no impact
          on your grade or credit in this class. You may choose to discontinue
          participation at any time without penalty.
        </p>
        <p>
          <strong>The purpose of the research:</strong> To explore how well just-in-time,
          low-friction visuo-vibrotactile feedback using an Apple Watch solves
          the problem of instructors’ delayed reactions to student feedback.
        </p>
        <p>
          <strong>The expected duration of the subject's participation:</strong> Up to one
          80-minute session.
        </p>
        <p>
          <strong>The procedures that the subject will be asked to follow in the
          research:</strong> You will use our system during your regularly scheduled
          lecture. The system consists of an instructor-facing Apple
          Watch application and a student-facing web application. You will use
          the web application to send three types of reactions to the
          instructor. Upon the conclusion of the class, you will answer a brief
          survey aimed to better understand your opinion of the system.
        </p>
        <p>
          <strong>The reasonably foreseeable risks or discomforts to the subject as a
          result of participation:</strong> You may be distracted or otherwise
          not able to fully perform their role as a student in class. All
          participation is voluntary and you may stop participating anytime. All
          feedback we collect is strictly confidential.
        </p>
        <p>
          <strong>The benefits to the subject:</strong> While there are no direct benefits,
          results from this study may help instructors better assess student
          understanding of the material during lectures. Likewise, your feedback
          is valuable input for this system to be deployed at a later date as an
          independent product.
        </p>
        <p>
          <strong>The alternative procedures, if any, that might be advantageous to the
          subject:</strong> The alternative is not to participate, which will not have 
          an effect on your course grade or relationship with the professor, 
          department, or University.
        </p>
        <hr style={{ visibility: 'hidden' }} />
        <p>
          <u>
            <strong>Additional information about the study:</strong>
          </u>
        </p>
        <p>
          <strong>Confidentiality:</strong>
        </p>
        <p>
          All records from this study will be kept confidential. Your responses
          will be kept private, and we will not include any information that
          will make it possible to identify you in any report we might publish.
        </p>
        <p>
          Research records will be stored securely in a locked cabinet and/or on
          password-protected computers. The research team will be the only party
          that will have access to your data.
        </p>
        <p>
          <strong>Compensation: </strong> You will be entered into a class raffle 
          for a $10 Amazon gift card, if you choose to do so.
        </p>
        <p>
          <strong>Who to contact with questions:</strong>
        </p>
        <p>
          <strong>Principal investigator:</strong> Andrés Monroy-Hernández,
          andresmh@princeton.edu
        </p>
        <p>
          If you have questions regarding your rights as a research subject, or
          if problems arise which you do not feel you can discuss with the
          Investigator, please contact the Institutional Review Board at:
        </p>
        <p>Phone: (609) 258-8543</p>
        <p>Email: irb@princeton.edu</p>
        <hr style={{ visibility: 'hidden' }} />
        <p>
          <u>
            <strong>Summary:</strong>
          </u>
        </p>
        <p>I understand the information that was presented and that:</p>
        <p>My participation is voluntary.</p>
        <p>
          Refusal to participate will involve no penalty or loss of benefits to
          which I am otherwise entitled. I may discontinue participation at any
          time without penalty or loss of benefits.
        </p>
        <p>
          I do not waive any legal rights or release Princeton University or its
          agents from liability for negligence. I hereby give my consent to be
          the subject of the research.
        </p>
        <p>
          I have read all the information provided on this form, am <strong>at 
          least 18 years of age</strong>, and <strong>consent</strong> to participate 
          in this study.
        </p>
        <br></br>
        <hr style={{ visibility: 'hidden' }} />
        <button class="agree" onClick={handleAgree}>
          I understand, and wish to proceed
        </button>
      </Modal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          ...gradientBackground, // Apply the gradient background
        }}
      >
        <div
          style={{
            fontSize: '50px', // Increase font size
            fontWeight: 'bold', // Make it bold
            color: 'white',
            marginBottom: '40px',
          }}
        >
          Haptic-Xcel
        </div>
        <input
          type="text"
          placeholder="Session ID"
          value={sessionId}
          onChange={(e) => {
            setSessionId(e.target.value.toUpperCase());
          }}
          style={{
            fontWeight: 'bold',
            marginBottom: '20px',
            padding: '5px',
            width: '300px', // Adjust width to make it the same size as the button
            height: '50px', // Adjust height to make it the same size as the button
            border: 'transparent', // Red border if session ID doesn't exist
            outline: 'none', // Remove the outline when focused
            textAlign: 'center', // Center-align the placeholder text
            borderRadius: '5px',
            fontSize: '20px', // Increase font size
          }}
        />
        <button onClick={handleEnterClick} className="enter">
          <strong>Enter</strong>
        </button>
        <div className={`popup ${showPopup ? 'show' : ''}`}>
          <FaStopCircle style={{ marginRight: '10px' }} /> Session ID doesn't
          exist
        </div>
      </div>
    </div>
  );
};

export default InputPage;
