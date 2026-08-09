/**
 * VELMORA PROPERTIES - Client Side Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initForms();
  initSearch();
  initSmoothScroll();
});

/**
 * Header Scroll Effects
 */
function initHeader() {
  const header = document.querySelector('.header-wrapper');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!toggle || !menu) return;
  
  const toggleMenu = () => {
    menu.classList.toggle('active');
    document.body.classList.toggle('mobile-nav-active');
    
    // Animate hamburger lines
    const spans = toggle.querySelectorAll('span');
    if (menu.classList.contains('active')) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };
  
  toggle.addEventListener('click', toggleMenu);
  
  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Intersection Observer for scroll animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animation is run
        observer.unobserve(entry.target);
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% visible
    rootMargin: '0px 0px -50px 0px' // adjust bottom margin
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * Contact and Enquiry Forms Handling
 */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show sending state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Enquiry...';
    
    // Simulate API request delay
    setTimeout(() => {
      const statusDiv = document.getElementById('formStatus');
      
      // Get form data (ready for integrations)
      const formData = {
        name: document.getElementById('formName').value,
        phone: document.getElementById('formPhone').value,
        requirement: document.getElementById('formRequirement').value,
        location: document.getElementById('formLocation').value,
        message: document.getElementById('formMessage').value
      };
      
      console.log('Velmora Properties Enquiry Submitted:', formData);
      
      // Show success message
      statusDiv.innerHTML = `Thank you, ${formData.name}. Your property enquiry has been sent successfully. Our team will contact you shortly.`;
      statusDiv.className = 'form-status success';
      statusDiv.style.display = 'block';
      
      // Reset button and form
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      
      // Auto scroll to message
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Hide status after 8 seconds
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 8000);
      
    }, 1500);
  });
}

/**
 * Premium Search/Discovery Simulator
 */
function initSearch() {
  const searchForm = document.getElementById('searchForm');
  if (!searchForm) return;
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const type = document.getElementById('searchType').value;
    const location = document.getElementById('searchLocation').value;
    const purpose = document.getElementById('searchPurpose').value;
    
    let alertMsg = `Velmora Properties: Searching for "${type}" properties in "${location}" for "${purpose}".\n\nlistings in these categories are coming soon. Our experts are tracking available options. Let's redirect you to direct WhatsApp enquiry to find matching properties now!`;
    
    alert(alertMsg);
    
    // Formulate a custom WhatsApp message
    const formattedMsg = encodeURIComponent(`Hello Velmora Properties, I am looking to ${purpose.toLowerCase()} a property.\nType: ${type}\nLocation: ${location}.\nPlease let me know if there are matching listings.`);
    window.open(`https://wa.me/917719454182?text=${formattedMsg}`, '_blank');
  });
}

/**
 * Handle smooth scrolls and hero scroll indicators
 */
function initSmoothScroll() {
  const scrollIndicator = document.querySelector('.hero-scroll');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('.search-container-outer') || document.querySelector('#properties');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
