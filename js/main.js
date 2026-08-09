/**
 * VELMORA PROPERTIES - Dynamic client-side operations & animations
 */

// Central Editable Data Structures
const PROPERTIES_DATA = [
  {
    name: "Luxury Premium Villa",
    location: "Mohali, Punjab",
    type: "House",
    area: "3,200 sq.ft.",
    bedrooms: 4,
    bathrooms: 4,
    price: "Price on Request",
    status: "Available [Placeholder]",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Commercial Retail Showroom",
    location: "Gurgaon, Haryana",
    type: "Showroom",
    area: "4,500 sq.ft.",
    bedrooms: "N/A",
    bathrooms: 2,
    price: "Price on Request",
    status: "Available [Placeholder]",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Agricultural & Farm Land Deals",
    location: "Himachal Pradesh",
    type: "Killa / Agricultural Land",
    area: "10 Acres",
    bedrooms: "N/A",
    bathrooms: "N/A",
    price: "Price on Request",
    status: "Available [Placeholder]",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Client Name Placeholder",
    role: "Property Investor",
    feedback: "This is a clean, editable testimonial placeholder text. Genuine customer feedback and testimonials will be displayed here once client reviews are verified.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Client Name Placeholder",
    role: "Residential Buyer",
    feedback: "This is a clean, editable testimonial placeholder text. Genuine customer feedback and testimonials will be displayed here once client reviews are verified.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Client Name Placeholder",
    role: "Commercial Partner",
    feedback: "This is a clean, editable testimonial placeholder text. Genuine customer feedback and testimonials will be displayed here once client reviews are verified.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  renderProperties();
  renderTestimonials();
  initHeroSlider();
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
  handleScroll();
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
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Intersection Observer for scroll animations (respects prefers-reduced-motion)
 */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    return;
  }

  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Dynamic Property Cards rendering
 */
function renderProperties() {
  const grid = document.getElementById('propertiesGrid');
  if (!grid) return;
  
  grid.innerHTML = PROPERTIES_DATA.map(prop => `
    <div class="property-card">
      <div class="property-img-wrapper">
        <img src="${prop.image}" alt="${prop.name}" loading="lazy">
        <div class="property-tag">${prop.status}</div>
      </div>
      <div class="property-details-panel">
        <span class="property-type-tag">${prop.type}</span>
        <h3 class="property-card-title">${prop.name}</h3>
        
        <div class="property-meta-row">
          <div class="property-meta-item">
            <span>Location:</span> ${prop.location}
          </div>
          <div class="property-meta-item">
            <span>Area:</span> ${prop.area}
          </div>
        </div>
        
        <div class="property-meta-row" style="margin-top: -1rem; border-top: 0; padding-top: 0;">
          <div class="property-meta-item">
            <span>Beds:</span> ${prop.bedrooms}
          </div>
          <div class="property-meta-item">
            <span>Baths:</span> ${prop.bathrooms}
          </div>
        </div>
        
        <div class="property-price-row">
          <span class="property-price">${prop.price}</span>
        </div>
        
        <div class="property-actions">
          <a href="#contact" class="btn btn-outline-green btn-sm">View Details</a>
          <a href="https://wa.me/917719454182?text=Hello%20Velmora%20Properties%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(prop.name)}%20located%20in%20${encodeURIComponent(prop.location)}." target="_blank" class="btn btn-whatsapp btn-sm">WhatsApp</a>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Dynamic Testimonial Cards rendering
 */
function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  
  grid.innerHTML = TESTIMONIALS_DATA.map(test => `
    <div class="testimonial-card">
      <div class="testimonial-quote">“</div>
      <p class="testimonial-feedback">${test.feedback}</p>
      <div class="testimonial-author">
        <img class="testimonial-avatar" src="${test.avatar}" alt="${test.name}" loading="lazy">
        <div class="testimonial-author-info">
          <h4 class="testimonial-name">${test.name}</h4>
          <span class="testimonial-role">${test.role}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Premium Automatic Slide Manager (Ken Burns visual slider)
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.slide-indicator-btn');
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  let slideInterval;
  const slideDuration = 4500; // 4.5 seconds per transition
  
  const showSlide = (index) => {
    slides.forEach(slide => {
      slide.classList.remove('active');
      const video = slide.querySelector('video');
      if (video) video.pause(); // Pause video on inactive slides
    });
    indicators.forEach(btn => btn.classList.remove('active'));
    
    currentIdx = (index + slides.length) % slides.length;
    slides[currentIdx].classList.add('active');
    indicators[currentIdx].classList.add('active');
    
    const activeVideo = slides[currentIdx].querySelector('video');
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(err => console.log('Video autoplay blocked by browser policies.', err));
    }
  };
  
  const nextSlide = () => {
    showSlide(currentIdx + 1);
  };
  
  const startAutoplay = () => {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, slideDuration);
  };
  
  const stopAutoplay = () => {
    if (slideInterval) clearInterval(slideInterval);
  };
  
  // Set click handlers on indicators
  indicators.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.currentTarget.getAttribute('data-slide-to'));
      showSlide(targetIdx);
      startAutoplay(); // Reset timer upon user interaction
    });
  });
  
  // Initialize first slide and start autoplay
  showSlide(0);
  startAutoplay();
}

/**
 * Lead Enquiry Forms Handling
 */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Submitting Assistance Request...';
    
    setTimeout(() => {
      const statusDiv = document.getElementById('formStatus');
      
      const formData = {
        name: document.getElementById('formName').value,
        phone: document.getElementById('formPhone').value,
        requirement: document.getElementById('formRequirement').value,
        type: document.getElementById('formType').value,
        location: document.getElementById('formLocation').value,
        budget: document.getElementById('formBudget').value,
        message: document.getElementById('formMessage').value
      };
      
      console.log('Velmora Properties Lead Request Submitted:', formData);
      
      statusDiv.innerHTML = `Request Submitted. Thank you ${formData.name}, our real estate advisors will reach out to you at ${formData.phone} shortly.`;
      statusDiv.className = 'form-status success';
      statusDiv.style.display = 'block';
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 9000);
      
    }, 1200);
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
    
    let alertMsg = `Velmora Properties Search: Matching "${type}" properties in "${location}" for "${purpose}"...\n\nlistings in these categories are coming soon. Let's redirect you to direct WhatsApp enquiry to find matching properties now!`;
    
    alert(alertMsg);
    
    const formattedMsg = encodeURIComponent(`Hello Velmora Properties, I am looking to ${purpose.toLowerCase()} a property.\nType: ${type}\nLocation: ${location}.\nPlease let me know if there are matching listings.`);
    window.open(`https://wa.me/917719454182?text=${formattedMsg}`, '_blank');
  });
}

/**
 * Handle smooth scrolls
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
