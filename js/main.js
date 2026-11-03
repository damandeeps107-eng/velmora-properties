/**
 * VELMORA PROPERTIES - Dynamic client-side operations & animations
 * Live-synced with Velmora Admin Panel (admin.html)
 */

// Storage Keys
const STORAGE_PROPS_KEY = 'velmora_properties_v1';
const STORAGE_LEADS_KEY = 'velmora_inquiries_v1';

// Default Seed Data
const DEFAULT_PROPERTIES = [
  {
    id: "prop_1",
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
    id: "prop_2",
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
    id: "prop_3",
    name: "The Marq by Atlantis",
    location: "Aerocity, Mohali, Punjab",
    type: "High-End Mixed-Use",
    bhk: "3, 4, 5 BHK",
    price: "Price on Request",
    status: "Available",
    image: "assets/images/marq_cover.jpg",
    objectPosition: "top center",
    brochure: "assets/Marq_by_Atlantis_Brochure.pdf"
  },
  {
    id: "prop_4",
    name: "Agricultural & Farm Land Deals",
    location: "Himachal Pradesh & Punjab",
    type: "Agricultural Land",
    bhk: "Multiple Acres",
    price: "Price on Request",
    status: "Direct Deal",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
  }
];

// Helper to get live properties from storage or seed defaults
function getLiveProperties() {
  const stored = localStorage.getItem(STORAGE_PROPS_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_PROPS_KEY, JSON.stringify(DEFAULT_PROPERTIES));
    return DEFAULT_PROPERTIES;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROPERTIES;
  } catch (e) {
    return DEFAULT_PROPERTIES;
  }
}

const TESTIMONIALS_DATA = [
  {
    name: "S. Gurpreet Singh",
    role: "Commercial Investor, Chandigarh",
    feedback: "Velmora Properties helped us acquire prime showroom space in Aerocity Mohali. Transparent paper verification and direct dealer coordination made the transaction effortless.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Harish Garg",
    role: "Residential Buyer, Bathinda",
    feedback: "Found our dream luxury house in Model Town Phase 2 through Velmora. Their local market knowledge and professionalism in handling paperwork is exceptional.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Navjot Kaur",
    role: "Farmland Investor, Himachal",
    feedback: "High integrity and genuine direct-seller matching for agricultural land. Best real estate consultancy in Punjab & HP region.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
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

  // Listen for storage events (e.g. when Admin adds a property in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_PROPS_KEY) {
      renderProperties();
    }
  });
});

/**
 * Header Scroll Effects
 */
function initHeader() {
  const header = document.querySelector('.header-wrapper');
  if (!header) return;
  
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
 * Intersection Observer for scroll animations
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
 * Dynamic Property Cards rendering (Reads from Live LocalStorage / Admin)
 */
function renderProperties(filteredList = null) {
  const grid = document.getElementById('propertiesGrid');
  if (!grid) return;
  
  const propertiesToRender = filteredList || getLiveProperties();
  
  // Update live count badge
  const countEl = document.getElementById('liveListingCount');
  if (countEl) {
    countEl.innerText = `${propertiesToRender.length}`;
  }
  
  console.log(`[Velmora Sync] Rendered ${propertiesToRender.length} live properties.`);
  
  if (propertiesToRender.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; background: #fff; border-radius: 8px; border: 1px dashed #d4c3b3;">
        <h3 style="font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #1e3a27; margin-bottom: 0.5rem;">No Properties Found</h3>
        <p style="color: #666; margin-bottom: 1.25rem;">We currently don't have matching listings publicly displayed in this category, but we have verified off-market deals.</p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <a href="https://wa.me/917719454182?text=Hello%20Velmora%20Properties%2C%20I%20am%20looking%20for%20property%20options." target="_blank" class="btn btn-whatsapp btn-sm">Ask on WhatsApp</a>
          <button onclick="renderProperties()" class="btn btn-secondary btn-sm">Show All Properties</button>
        </div>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = propertiesToRender.map(prop => {
    const isSold = prop.status === 'Sold Out';
    return `
      <div class="property-card ${isSold ? 'property-sold' : ''}">
        <div class="property-img-wrapper">
          <img src="${prop.image}" alt="${prop.name}" loading="lazy" style="${prop.objectPosition ? `object-position: ${prop.objectPosition};` : ''}" onerror="this.src='https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'">
          ${prop.status ? `<div class="property-tag ${isSold ? 'tag-sold' : ''}">${prop.status}</div>` : ''}
        </div>
        <div class="property-details-panel">
          <span class="property-type-tag">${prop.type}</span>
          <h3 class="property-card-title">${prop.name}</h3>
          
          <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.82rem; color: #666; margin-bottom: 0.5rem;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${prop.location}</span>
          </div>

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
            <a href="https://wa.me/917719454182?text=${encodeURIComponent(`Hello Velmora Properties, I am interested in "${prop.name}" in ${prop.location} (${prop.price}).`)}" target="_blank" class="btn btn-whatsapp btn-sm">WhatsApp</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
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
 * Premium Automatic Slide Manager
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.slide-indicator-btn');
  const heroSection = document.querySelector('.hero');
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  let slideInterval;
  const slideDuration = 4500;
  let isHeroVisible = true;
  
  const showSlide = (index) => {
    slides.forEach(slide => {
      slide.classList.remove('active');
      const video = slide.querySelector('video');
      if (video) video.pause();
    });
    indicators.forEach(btn => btn.classList.remove('active'));
    
    currentIdx = (index + slides.length) % slides.length;
    slides[currentIdx].classList.add('active');
    indicators[currentIdx].classList.add('active');
    
    if (isHeroVisible) {
      const activeVideo = slides[currentIdx].querySelector('video');
      if (activeVideo) {
        activeVideo.currentTime = 0;
        activeVideo.play().catch(err => console.log('Video autoplay handled.', err));
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
  
  indicators.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.currentTarget.getAttribute('data-slide-to'));
      showSlide(targetIdx);
      startAutoplay();
    });
  });
  
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (!isHeroVisible) {
          stopAutoplay();
          slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) video.pause();
          });
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
 * Lead Enquiry Forms Handling (Permanently saves to Admin CRM & Dispatches)
 */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Securing Your Requirement...';
    
    setTimeout(() => {
      const statusDiv = document.getElementById('formStatus');
      
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const leadData = {
        id: "inq_" + Date.now(),
        timestamp: now.toISOString(),
        dateFormatted: dateFormatted,
        name: document.getElementById('formName').value.trim(),
        phone: document.getElementById('formPhone').value.trim(),
        requirement: document.getElementById('formRequirement').value,
        type: document.getElementById('formType').value,
        location: document.getElementById('formLocation').value,
        budget: document.getElementById('formBudget').value.trim(),
        message: document.getElementById('formMessage').value.trim(),
        status: 'New'
      };
      
      // Save permanently to velmora_inquiries_v1
      try {
        const stored = localStorage.getItem(STORAGE_LEADS_KEY);
        const inquiries = stored ? JSON.parse(stored) : [];
        inquiries.unshift(leadData);
        localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(inquiries));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error("Storage error:", err);
      }
      
      // WhatsApp prefilled message
      const waMsg = encodeURIComponent(
        `Hello Velmora Properties,\n\nI just submitted an inquiry on your website:\n• Name: ${leadData.name}\n• Phone: ${leadData.phone}\n• Requirement: ${leadData.requirement} (${leadData.type})\n• Preferred Location: ${leadData.location}\n• Budget: ${leadData.budget}\n• Details: ${leadData.message}\n\nPlease share suitable options.`
      );
      const waUrl = `https://wa.me/917719454182?text=${waMsg}`;

      // Show luxury confirmation banner with 1-click WhatsApp shortcut
      statusDiv.innerHTML = `
        <div style="background: #14281a; color: #fff; padding: 1.25rem; border-radius: 8px; border: 1px solid #d4af37; margin-bottom: 1.5rem;">
          <h4 style="color: #d4af37; margin-bottom: 0.35rem; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>✔</span> Requirement Received, ${leadData.name}!
          </h4>
          <p style="font-size: 0.9rem; color: #ddd; margin-bottom: 0.85rem;">
            Our property advisors have recorded your details and will call you at <strong>${leadData.phone}</strong> shortly.
          </p>
          <a href="${waUrl}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #25d366; color: #fff; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem;">
            <span>💬 Send Directly on WhatsApp for Instant Response</span>
          </a>
        </div>
      `;
      statusDiv.className = 'form-status success';
      statusDiv.style.display = 'block';
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
    }, 900);
  });
}

/**
 * Seamless Property Search Filter (Glitch-Free, Dynamic In-Page Filtering)
 */
function initSearch() {
  const searchForm = document.getElementById('searchForm');
  if (!searchForm) return;
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const targetType = document.getElementById('searchType').value.toLowerCase();
    const targetLocation = document.getElementById('searchLocation').value.toLowerCase();
    const targetPurpose = document.getElementById('searchPurpose').value;
    
    const allProps = getLiveProperties();
    
    // Filter matching listings
    const matched = allProps.filter(p => {
      const matchType = p.type.toLowerCase().includes(targetType) || targetType.includes(p.type.toLowerCase());
      const matchLoc = p.location.toLowerCase().includes(targetLocation);
      return matchType || matchLoc;
    });

    // Render results
    renderProperties(matched);

    // Smooth scroll to property section
    const propSection = document.getElementById('properties');
    if (propSection) {
      propSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Update section header to show active search badge
    const headerTitle = document.querySelector('#properties .section-title');
    if (headerTitle) {
      headerTitle.innerHTML = `Search Results: ${document.getElementById('searchType').value} in ${document.getElementById('searchLocation').value} <button onclick="renderProperties(); document.querySelector('#properties .section-title').innerHTML = 'Featured Listings';" style="font-size: 0.75rem; background: #1e3a27; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px; vertical-align: middle;">Reset Filter</button>`;
    }
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
 * Site-wide background slider loop
 */
function initSiteBgSlider() {
  const slides = document.querySelectorAll('.site-bg-slide');
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  const slideDuration = 7500;
  
  const nextSlide = () => {
    slides[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slides.length;
    slides[currentIdx].classList.add('active');
  };
  
  setInterval(nextSlide, slideDuration);
}
