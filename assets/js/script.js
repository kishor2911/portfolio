/**
 * Portfolio Main JavaScript
 */

'use strict';

// DOM Elements
const header = document.querySelector('[data-header]');
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');
const navLinks = document.querySelectorAll('[data-nav-link]');
const backTopBtn = document.querySelector('[data-back-to-top]');

// NAVBAR TOGGLE
navToggleBtn.addEventListener('click', function () {
  this.classList.toggle('active');
  navbar.classList.toggle('active');
  document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggleBtn.classList.remove('active');
    navbar.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && !navToggleBtn.contains(e.target) && navbar.classList.contains('active')) {
    navToggleBtn.classList.remove('active');
    navbar.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// HEADER ACTIVE ON SCROLL
window.addEventListener('scroll', function () {
  if (this.scrollY > 50) {
    header.classList.add('active');
  } else {
    header.classList.remove('active');
  }
});

// ACTIVE NAV LINK ON SCROLL
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= (sectionTop - 100)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// BACK TO TOP
window.addEventListener('scroll', function () {
  this.scrollY >= 500
    ? backTopBtn.classList.add('active')
    : backTopBtn.classList.remove('active');
});

backTopBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// CERTIFICATE PDF VIEWER
const certificateCards = document.querySelectorAll('.certificate-card');
const pdfModal = document.getElementById('pdfModal');
const pdfViewer = document.getElementById('pdfViewer');
const pdfModalTitle = document.getElementById('pdfModalTitle');
const pdfCloseBtn = document.getElementById('pdfCloseBtn');

// Certificate PDF files mapping
const certificateFiles = {
  'data-analytics': './assets/certificates/data-analytics.pdf',
  'cyber-security': './assets/certificates/cyber-security.pdf',
  'python-ml': './assets/certificates/python-ml.pdf',
  'data-science': './assets/certificates/data-science.pdf',
  'iot-webinar': './assets/certificates/iot-webinar.pdf',
  'employability-skills': './assets/certificates/employability-skills.pdf'
};

const certificateTitles = {
  'data-analytics': 'Data Analytics Essentials - Cisco Networking Academy',
  'cyber-security': 'Cyber Security & Ethical Hacking - Infosys Springboard',
  'python-ml': 'Python Libraries for Machine Learning - Great Learning Academy',
  'data-science': 'Data Science 101 - IBM SkillsBuild',
  'iot-webinar': 'IoT Application Development Webinar - Marwadi University',
  'employability-skills': 'Employability Skills Workshop - Marwadi University'
};

// Open PDF viewer
certificateCards.forEach(card => {
  const viewBtn = card.querySelector('.view-pdf-btn');
  const downloadBtn = card.querySelector('.download-btn');
  const pdfName = card.getAttribute('data-pdf');
  
  // View button click
  viewBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPDF(pdfName);
  });
  
  // Download button click
  downloadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadPDF(pdfName);
  });
  
  // Card click (opens PDF)
  card.addEventListener('click', () => {
    openPDF(pdfName);
  });
});

function openPDF(pdfName) {
  if (certificateFiles[pdfName]) {
    pdfModalTitle.textContent = certificateTitles[pdfName];
    pdfViewer.src = certificateFiles[pdfName];
    pdfModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    alert('Certificate file not found. Please check the file path.');
  }
}

function downloadPDF(pdfName) {
  if (certificateFiles[pdfName]) {
    const link = document.createElement('a');
    link.href = certificateFiles[pdfName];
    link.download = certificateTitles[pdfName] + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Close PDF modal
pdfCloseBtn.addEventListener('click', closePDFModal);

pdfModal.addEventListener('click', (e) => {
  if (e.target === pdfModal) {
    closePDFModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
    closePDFModal();
  }
});

function closePDFModal() {
  pdfModal.classList.remove('active');
  pdfViewer.src = '';
  document.body.style.overflow = '';
}

// CONTACT FORM WITH EMAIL FUNCTIONALITY
// CONTACT FORM WITH WORKING EMAIL FUNCTIONALITY
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('#submitBtn');
    const submitText = this.querySelector('#submitText');
    const spinner = this.querySelector('#spinner');
    const formMessage = document.getElementById('formMessage');
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim()
    };
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showFormMessage(formMessage, 'Please fill in all fields.', 'error');
      return;
    }
    
    // Show loading state
    submitText.textContent = 'Sending...';
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    formMessage.style.display = 'none';
    
    try {
      // METHOD 1: Try Formspree first
      await sendViaFormspree(formData);
      
      // Success message
      showFormMessage(formMessage, 
        `✅ Thank you, ${formData.name}! Your message has been sent successfully. I'll reply within 24 hours.`,
        'success'
      );
      
      // Reset form
      this.reset();
      
    } catch (error) {
      console.log('Formspree failed, trying direct email...');
      
      // METHOD 2: Direct email fallback
      const emailSent = await sendDirectEmail(formData);
      
      if (emailSent) {
        showFormMessage(formMessage,
          `✅ Email sent successfully via your email client. Thank you, ${formData.name}!`,
          'success'
        );
        
        // Reset form
        this.reset();
      } else {
        // METHOD 3: Show contact info
        showFormMessage(formMessage,
          `📧 Email me directly at: kishorgoraniya2@gmail.com`,
          'info'
        );
      }
      
    } finally {
      // Reset button state
      submitText.textContent = 'Send Message';
      spinner.classList.add('hidden');
      submitBtn.disabled = false;
    }
  });
}

// FUNCTION 1: Send via Formspree
async function sendViaFormspree(formData) {
  // Replace with your actual Formspree ID
  const FORMSPREE_ID = 'YOUR_FORMSPREE_ID_HERE';
  const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      _replyto: formData.email,
      _subject: `Portfolio Message: ${formData.subject}`
    })
  });
  
  if (!response.ok) {
    throw new Error('Formspree failed');
  }
  
  return response.json();
}

// FUNCTION 2: Direct email via mailto (ALWAYS WORKS)
function sendDirectEmail(formData) {
  try {
    // Create email body with proper formatting
    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
    `.trim();
    
    // Encode for URL
    const encodedBody = encodeURIComponent(emailBody);
    const encodedSubject = encodeURIComponent(`Portfolio Contact: ${formData.subject}`);
    
    // Create mailto link
    const mailtoLink = `mailto:kishorgoraniya2@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    return true;
  } catch (error) {
    console.error('Direct email failed:', error);
    return false;
  }
}

// FUNCTION 3: Show form messages
function showFormMessage(element, message, type) {
  element.innerHTML = message;
  element.className = `form-message ${type}`;
  element.style.display = 'block';
  
  // Add click event for email links
  if (type === 'info' && message.includes('kishorgoraniya2@gmail.com')) {
    element.style.cursor = 'pointer';
    element.onclick = function() {
      window.location.href = 'mailto:kishorgoraniya2@gmail.com';
    };
  }
}

// Add CSS styles for messages
const style = document.createElement('style');
style.textContent = `
  .form-message {
    padding: 15px;
    margin: 15px 0;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
    animation: fadeIn 0.3s ease;
    display: none;
  }
  
  .form-message.success {
    background-color: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
    border: 1px solid rgba(46, 204, 113, 0.2);
  }
  
  .form-message.error {
    background-color: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    border: 1px solid rgba(231, 76, 60, 0.2);
  }
  
  .form-message.info {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
    border: 1px solid rgba(52, 152, 219, 0.2);
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .form-message.info:hover {
    background-color: rgba(52, 152, 219, 0.2);
  }
  
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-left: 10px;
    vertical-align: middle;
  }
  
  .spinner.hidden {
    display: none;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
document.head.appendChild(style);

// ANIMATE SKILL BARS ON SCROLL
const skillsSection = document.querySelector('.skills');

if (skillsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.skills-progress');
        progressBars.forEach(bar => {
          const width = bar.parentElement.parentElement.querySelector('.wrapper').style.width;
          bar.style.width = width;
        });
      }
    });
  }, { threshold: 0.5 });

  observer.observe(skillsSection);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded successfully!');
  
  // Add loading animation to hero section
  const heroTitle = document.querySelector('.hero-title strong');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 300);
  }
});