/**
 * VELMORA PROPERTIES - Dynamic client-side operations & animations
 */

// Central Editable Data Structures
const PROPERTIES_DATA = [
  {
    name: "Mohali Crown",
    location: "Block B, Aerocity, Mohali",
    type: "Showrooms & Retail",
    bhk: "3 BHK",
    price: "Price on Request",
    status: "New Launch",
    image: "assets/images/mohali_crown_cover.png",
    brochure: "assets/Mohali_Crown_Brochure.pdf"
  },
  {
    name: "Marina Suites Premium Apartments",
    location: "Mohali, Punjab",
    type: "Luxury Residential",
    bhk: "1, 2 BHK",
    price: "Price on Request",
    status: "Exclusive Listing",
    image: "assets/images/marina_cover.png",
    brochure: "assets/Marina_Suites_Brochure.pdf"
  },
  {
    name: "The Marq by Atlantis",
    location: "Aerocity, Mohali, Punjab",
    type: "High-End Mixed-Use",
    bhk: "3, 4, 5 BHK",
    price: "Price on Request",
    status: "",
    image: "assets/images/marq_cover.jpg",
    objectPosition: "top center",
    brochure: "assets/Marq_by_Atlantis_Brochure.pdf"
  },
  {
    name: "Agricultural & Farm Land Deals",
    location: "Himachal Pradesh & Punjab",
    type: "Agricultural Land",
    bhk: "",
    price: "Price on Request",
    status: "Direct Deal",
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
  initSiteBgSlider();
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
  
  window.addEventListener('scroll', handleScroll, { passive: true });
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
        <img src="${prop.image}" alt="${prop.name}" loading="lazy" style="${prop.objectPosition ? `object-position: ${prop.objectPosition};` : ''}">
        ${prop.status ? `<div class="property-tag">${prop.status}</div>` : ''}
      </div>
      <div class="property-details-panel">
        <span class="property-type-tag">${prop.type}</span>
        <h3 class="property-card-title">${prop.name}</h3>
        
        ${prop.bhk ? `
        <div class="property-meta-row" style="border-bottom: none; padding-bottom: 0; margin-bottom: 0.5rem;">
          <div class="property-meta-item">
            <span>Configuration:</span> ${prop.bhk}
          </div>
        </div>
        ` : ''}
        
        <div class="property-price-row">
          <span class="property-price">${prop.price}</span>
        </div>
        
        <div class="property-actions">
          ${prop.brochure ? `
            <a href="${prop.brochure}" download class="btn btn-outline-green btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Brochure
            </a>
          ` : `
            <a href="#contact" class="btn btn-outline-green btn-sm">View Details</a>
          `}
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
  const heroSection = document.querySelector('.hero');
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  let slideInterval;
  const slideDuration = 4500; // 4.5 seconds per transition
  let isHeroVisible = true;
  
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
    
    if (isHeroVisible) {
      const activeVideo = slides[currentIdx].querySelector('video');
      if (activeVideo) {
        activeVideo.currentTime = 0;
        activeVideo.play().catch(err => console.log('Video autoplay blocked by browser policies.', err));
      }
    }
  };
  
  const nextSlide = () => {
    showSlide(currentIdx + 1);
  };
  
  const startAutoplay = () => {
    stopAutoplay();
    if (isHeroVisible) {
      slideInterval = setInterval(nextSlide, slideDuration);
    }
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
  
  // Intersection Observer to stop all slideshow animations and videos when scrolled out
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (!isHeroVisible) {
          stopAutoplay();
          // Pause all videos
          slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) video.pause();
          });
          // Hide hero visuals to stop GPU paint loops
          heroSection.classList.add('hero-hidden');
        } else {
          heroSection.classList.remove('hero-hidden');
          showSlide(currentIdx);
          startAutoplay();
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(heroSection);
  } else {
    showSlide(0);
    startAutoplay();
  }
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

/**
 * Site-wide background slider loop (smooth crossfade every 7.5 seconds)
 */
function initSiteBgSlider() {
  const slides = document.querySelectorAll('.site-bg-slide');
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  const slideDuration = 7500; // 7.5 seconds per transition
  
  const nextSlide = () => {
    slides[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slides.length;
    slides[currentIdx].classList.add('active');
  };
  
  setInterval(nextSlide, slideDuration);
}
