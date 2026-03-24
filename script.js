// ========== FIREBASE CONFIGURATION ==========
const firebaseConfig = {
  apiKey: "AIzaSyD_m5yTOkHCj42f8zzmpNmg7I6dqtc1vNY",
  authDomain: "udufafrica-project.firebaseapp.com",
  projectId: "udufafrica-project",
  storageBucket: "udufafrica-project.firebasestorage.app",
  messagingSenderId: "1070479742500",
  appId: "1:1070479742500:web:3b77676d5592860d44aab1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {

  // ========== SLIDER ==========
  const slides = document.querySelectorAll(".slide");
  const mapImage = document.getElementById("mapImage");

  if (slides.length && mapImage) {
    const images = ["slide1.webp", "slide2.webp", "slide3.webp"];
    let index = 0;

    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
      mapImage.style.backgroundImage = `url(${images[index]})`;
    }, 5000);
  }

  // ========== INTERSECTION OBSERVER ==========
  const animateOnScroll = (selector, className, threshold = 0.1) => {
    const el = document.querySelector(selector);
    if (!el) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) el.classList.add(className);
      });
    }, { threshold });

    observer.observe(el);
  };

  animateOnScroll(".categories-container", "show");
  animateOnScroll(".why-container", "show");

  // ========== COURSE CARDS ==========
  const cards = document.querySelectorAll(".course-card");
  if (cards.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
  }

  // ========== LIKE SYSTEM ==========
  const hearts = document.querySelectorAll(".heart");
  hearts.forEach(heart => {
    const card = heart.closest(".course-card");
    if (!card) return;

    const courseId = card.dataset.course;
    const countEl = heart.querySelector(".like-count");

    if (!courseId || !countEl) return;

    let likes = JSON.parse(localStorage.getItem("courseLikes")) || {};
    let liked = JSON.parse(localStorage.getItem("likedCourses")) || {};

    if (!likes[courseId]) likes[courseId] = 0;
    countEl.textContent = likes[courseId];

    if (liked[courseId]) heart.classList.add("liked");

    heart.addEventListener("click", () => {
      likes = JSON.parse(localStorage.getItem("courseLikes")) || {};
      liked = JSON.parse(localStorage.getItem("likedCourses")) || {};

      if (!likes[courseId]) likes[courseId] = 0;

      if (liked[courseId]) {
        likes[courseId] = Math.max(0, likes[courseId] - 1);
        delete liked[courseId];
        heart.classList.remove("liked");
      } else {
        likes[courseId]++;
        liked[courseId] = true;
        heart.classList.add("liked");
      }

      localStorage.setItem("courseLikes", JSON.stringify(likes));
      localStorage.setItem("likedCourses", JSON.stringify(liked));
      countEl.textContent = likes[courseId];
    });
  });

  // ========== CERTIFICATE PROTECTION ==========
  const certificate = document.querySelector(".certificate-img");
  if (certificate) {
    const prevent = e => e.preventDefault();
    certificate.addEventListener("contextmenu", prevent);
    certificate.addEventListener("dragstart", prevent);
    certificate.addEventListener("touchstart", prevent, { passive: false });
  }

  // ========== SIDE MENU (FIXED VERSION) ==========
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navDropdowns = document.querySelectorAll(".nav-dropdown");

  if (hamburger && navMenu) {
    // Open/Close main side drawer
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Toggle the X animation and the slide menu
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      
      // Prevent scrolling when menu is open
      if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Handle Dropdowns within the menu
    navDropdowns.forEach(drop => {
      const btn = drop.querySelector(".nav-dropbtn");
      if (btn) {
        btn.addEventListener("click", (e) => {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle open state for this dropdown (matches CSS .open)
            drop.classList.toggle("open");
            
            // Close other dropdowns
            navDropdowns.forEach(other => {
              if (other !== drop) other.classList.remove("open");
            });
          }
        });
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        navDropdowns.forEach(d => d.classList.remove("open"));
        document.body.style.overflow = "";
      }
    });
  }

  // ========== CATEGORY DROPDOWNS ==========
  const catDropdowns = document.querySelectorAll(".category-dropdown");

  catDropdowns.forEach(drop => {
    const btn = drop.querySelector(".dropdown-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      catDropdowns.forEach(d => {
        if (d !== drop) d.classList.remove("active");
      });

      drop.classList.toggle("active");
    });
  });

  document.addEventListener("click", () => {
    catDropdowns.forEach(d => d.classList.remove("active"));
  });

  // ========== SCROLL ==========
  function scrollToElement(selector) {
    const target = document.querySelector(selector);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (navMenu) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
    }
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-scroll]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.getAttribute("data-scroll");
      if (id) scrollToElement(`#${id}`);
    });
  });

  // ========== COURSE FORM ==========
  const courseButtons = document.querySelectorAll(".course-card .course-btn");
  const popup = document.getElementById("courseFormPopup");
  const form = document.getElementById("courseForm");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const courseNameInput = document.getElementById("courseNameInput");

  const courseRedirectMap = {
    "Volunteer Orientation Course": "volunteer-orientation.html",
    "Executive Leadership Academy": "executive-leadership-academy.html",
    "Diversity, Equity, and Inclusion (DEI) Course": "dei-course.html",
    "UDUF Africa Team Leadership Course": "team-leadership.html",
    "Effective Team Leadership Course": "effective-team-leadership.html",
    "Emotional Intelligence in Leadership": "emotional-intelligence.html",
    "Community Service in Leadership": "community-service.html"
  };

  if (courseButtons.length && popup && form) {

    courseButtons.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();

        const courseName = btn.getAttribute("data-course-name");
        const userEmail = localStorage.getItem("userEmail");

        if (userEmail) {
          const docId = `${userEmail}_${courseName.replace(/\s/g, "_")}`;
          const docSnap = await db.collection("users").doc(docId).get();

          if (docSnap.exists) {
            alert("You've already signed up for this course.");
            const redirectPage = courseRedirectMap[courseName];
            if (redirectPage) window.location.href = redirectPage;
            return;
          }
        }

        if (courseNameInput) courseNameInput.value = courseName;
        popup.style.display = "flex";
      });
    });

    closeFormBtn?.addEventListener("click", () => {
      popup.style.display = "none";
      form.reset();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const courseName = courseNameInput?.value || "";
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();

      if (!name || !email || !phone) return;

      try {
        const docId = `${email}_${courseName.replace(/\s/g, "_")}`;

        await db.collection("users").doc(docId).set({
          name,
          email,
          phone,
          courseName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        localStorage.setItem("userEmail", email);
        popup.style.display = "none";
        form.reset();

        const redirectPage = courseRedirectMap[courseName];

        if (redirectPage) {
          window.location.href = redirectPage;
        } else {
          alert("Successfully signed up!");
          window.location.href = "index.html";
        }

      } catch (err) {
        console.error(err);
        alert("Error submitting form.");
      }
    });
  }

  // ========== APPLY BUTTON ==========
  const applyButtons = document.querySelectorAll(".apply-now-btn, .explore-programs-btn, .explore-courses-btn");

  applyButtons.forEach(btn => {
    // Skip hero buttons to prevent popup from opening
    if (btn.closest('.hero-buttons')) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (courseNameInput) courseNameInput.value = "General Inquiry";
      if (popup) popup.style.display = "flex";
    });
  });

});