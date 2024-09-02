import React from 'react';
import './Info.css';

const Info = () => {
  return (
    <div className="info-container">
      <h1>What is Legit anot?</h1>
      <p>
        Our website is designed to enhance online safety by providing a simple, user-friendly tool for verifying the legitimacy of digital content, particularly links. It aims to help users, regardless of technical expertise, easily identify and avoid malicious threats. We aim to empower individuals to confidently distinguish between genuine and fraudulent interactions, ensuring a safer digital experience for everyone.
      </p>

      <h2>Score Evaluation Criteria (100%)</h2>
      
      <div className="criteria-grid">
        <div className="criteria-box">
          <h3>AI Safety Rating (20%)</h3>
          <ul>
            <li>AI gives high safety rating: <strong>+20%</strong></li>
            <li>AI gives medium safety rating: <strong>+10%</strong></li>
            <li>AI gives low safety rating: <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>SSL Certificate Authority (20%)</h3>
          <ul>
            <li>Valid SSL certificate from a well-known provider: <strong>+20%</strong></li>
            <li>Valid SSL certificate from a less-known provider: <strong>+10%</strong></li>
            <li>No SSL certificate or invalid: <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>Checks (20%)</h3>
          <ul>
            <li>Less than 60% of average checks (not very dangerous): <strong>+20%</strong></li>
            <li>60-110% of average checks (potentially in the danger zone): <strong>+10%</strong></li>
            <li>More than 110% of average checks (most likely dangerous): <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>Link Origin (10%)</h3>
          <ul>
            <li>Organic search (e.g., Google, Bing): <strong>+10%</strong></li>
            <li>Direct (e.g., typed directly or bookmarked): <strong>+8%</strong></li>
            <li>Paid search (e.g., sponsored links from search engines): <strong>+6%</strong></li>
            <li>Display ads (e.g., banner ads on websites): <strong>+4%</strong></li>
            <li>Social media (e.g., Facebook, Twitter, Instagram): <strong>+2%</strong></li>
            <li>Email (e.g., links from promotional or unsolicited emails): <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>Blacklisted (10%)</h3>
          <ul>
            <li>Website is not blacklisted: <strong>+10%</strong></li>
            <li>Website is blacklisted: <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>Visits (5%)</h3>
          <ul>
            <li>More than 5000 visits (normal): <strong>+5%</strong></li>
            <li>Less than 5000 visits (quite dangerous): <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>Pages per Visit (5%)</h3>
          <ul>
            <li>More than 2 pages per visit (not so dangerous): <strong>+5%</strong></li>
            <li>1-2 pages per visit (quite dangerous): <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>Average Visit Duration (5%)</h3>
          <ul>
            <li>More than 2 minutes (not so dangerous): <strong>+5%</strong></li>
            <li>Less than 2 minutes (quite dangerous): <strong>0%</strong></li>
          </ul>
        </div>

        <div className="criteria-box">
          <h3>Bounce Rate (5%)</h3>
          <ul>
            <li>Less than 75%: <strong>+5%</strong></li>
            <li>More than 75% (very dangerous): <strong>0%</strong></li>
          </ul>
        </div>
      </div>

      <h2>APIs We Use</h2>
      <ul>
        <li>Google Safe Search</li>
        <li>SimilarWeb (Future incorporation)</li>
      </ul>

      <h2>References</h2>
      <ul>
        <li>
          AdminLTE. GitHub. Available at: <a href="https://github.com/ColorlibHQ/AdminLTE" target="_blank" rel="noopener noreferrer">https://github.com/ColorlibHQ/AdminLTE</a>. (Accessed: 2 September 2024).
        </li>
      </ul>
    </div>
  );
};

export default Info;
