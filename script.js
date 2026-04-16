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

  // ========== SIDE MENU ==========
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navDropdowns = document.querySelectorAll(".nav-dropdown");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
    });
    navDropdowns.forEach(drop => {
      const btn = drop.querySelector(".nav-dropbtn");
      if (btn) {
        btn.addEventListener("click", (e) => {
          if (window.innerWidth <= 900) {
            e.preventDefault(); e.stopPropagation();
            drop.classList.toggle("open");
            navDropdowns.forEach(other => { if (other !== drop) other.classList.remove("open"); });
          }
        });
      }
    });
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
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        catDropdowns.forEach(d => { if (d !== drop) d.classList.remove("active"); });
        drop.classList.toggle("active");
      });
    }
  });
  document.addEventListener("click", () => catDropdowns.forEach(d => d.classList.remove("active")));

  // ========== SCROLL ==========
  function scrollToElement(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (navMenu) { hamburger.classList.remove("active"); navMenu.classList.remove("active"); }
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-scroll]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.getAttribute("data-scroll");
      if (id) scrollToElement(`#${id}`);
    });
  });

  // ========== COURSE FORM LOGIC ==========
  const courseButtons = document.querySelectorAll(".course-card .course-btn");
  const popup = document.getElementById("courseFormPopup");
  const form = document.getElementById("courseForm");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const closeFormX = document.getElementById("closeFormX");
  const courseNameInput = document.getElementById("courseNameInput");
  const redirectModal = document.getElementById("redirectModal");
  const certFieldContainer = document.getElementById("certFieldContainer");
  const formMessage = document.getElementById("formMessage");

  const courseRedirectMap = {
    "Volunteer Orientation Course": "volunteer-orientation.html",
    "Executive Leadership Academy": "executive-leadership-academy.html",
    "Diversity, Equity, and Inclusion (DEI) Course": "dei-course.html",
    "UDUF Africa Team Leadership Course": "team-leadership.html",
    "Effective Team Leadership Course": "effective-team-leadership.html",
    "Emotional Intelligence in Leadership": "emotional-intelligence.html",
    "Community Service in Leadership": "community-service.html"
  };

  const showMessage = (msg, isError = true) => {
    formMessage.textContent = msg;
    formMessage.className = isError ? "form-message error" : "form-message success";
    formMessage.style.display = "block";
  };

  if (courseButtons.length && popup && form) {
    courseButtons.forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const courseName = btn.getAttribute("data-course-name");
        const userEmail = localStorage.getItem("userEmail");
        formMessage.style.display = "none";

        // Check if already signed up
        if (userEmail) {
          const docId = `${userEmail}_${courseName.replace(/\s/g, "_")}`;
          const docSnap = await db.collection("users").doc(docId).get();
          if (docSnap.exists) {
            if (redirectModal) redirectModal.style.display = "flex";
            const redirectPage = courseRedirectMap[courseName];
            if (redirectPage) setTimeout(() => { window.location.href = redirectPage; }, 2000);
            return;
          }
        }

        // Setup Form
        courseNameInput.value = courseName;
        // Show cert field for all courses EXCEPT orientation
        if (courseName === "Volunteer Orientation Course") {
          certFieldContainer.style.display = "none";
          const certInput = document.getElementById("certCodeInput");
          if (certInput) certInput.required = false;
        } else {
          certFieldContainer.style.display = "block";
          const certInput = document.getElementById("certCodeInput");
          if (certInput) certInput.required = true;
        }
        popup.style.display = "flex";
      });
    });

    const closeAll = () => { popup.style.display = "none"; form.reset(); formMessage.style.display = "none"; };
    closeFormBtn?.addEventListener("click", closeAll);
    closeFormX?.addEventListener("click", closeAll);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const courseName = courseNameInput.value;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const certCodeRaw = form.certCode ? form.certCode.value.trim() : "";
      const certCode = certCodeRaw.toUpperCase(); // normalize to uppercase for consistent lookup

      // 1. Validation for Non-Orientation courses
      if (courseName !== "Volunteer Orientation Course") {
        if (!certCode) {
          showMessage("Please enter your Orientation Course certificate code.");
          return;
        }
        
        try {
          // Query the certificates collection by the 'code' field (document ID is the code)
          // First try to get document by ID (if code is used as document ID)
          let certDoc = await db.collection("certificates").doc(certCode).get();
          
          // If not found by ID, try to query by 'code' field
          if (!certDoc.exists) {
            const querySnapshot = await db.collection("certificates").where("code", "==", certCode).get();
            if (!querySnapshot.empty) {
              certDoc = querySnapshot.docs[0];
            }
          }
          
          // Check if certificate document exists
          if (!certDoc.exists) {
            showMessage("Invalid certificate code. Please complete the Orientation Course and use the code from your certificate.");
            return;
          }

          const certData = certDoc.data();
          
          // Verify that the certificate is for the correct course
          // Check both 'course' and 'courseId' fields for flexibility
          const certCourse = certData.course || certData.courseId;
          if (certCourse !== "volunteer_orientation" && certCourse !== "Volunteer Orientation Course") {
            showMessage("This certificate is not for the Volunteer Orientation Course. Please complete the correct orientation course.");
            return;
          }

          // Verify email matches (case-insensitive)
          const certEmail = certData.email || certData.userEmail;
          if (certEmail && certEmail.toLowerCase() !== email.toLowerCase()) {
            showMessage("Please enter the email address that was used when you completed the Orientation Course.");
            return;
          }
          
          // Optional: Store the certificate code for reference
          console.log("Certificate validated successfully for:", email);
          
        } catch (err) {
          console.error("Certificate validation error:", err);
          showMessage("Unable to verify certificate. Please check your internet connection and try again.");
          return;
        }
      }

      // 2. Process Signup
      try {
        const docId = `${email}_${courseName.replace(/\s/g, "_")}`;
        await db.collection("users").doc(docId).set({
          name, email, phone, courseName, certCodeUsed: certCode || "N/A",
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
        console.error("Signup error:", err);
        showMessage("Error submitting form. Please check your connection and try again.");
      }
    });
  }

  // ========== APPLY BUTTONS ==========
  const applyButtons = document.querySelectorAll(".apply-now-btn, .explore-programs-btn, .explore-courses-btn");
  applyButtons.forEach(btn => {
    if (btn.closest('.hero-buttons')) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      courseNameInput.value = "General Inquiry";
      certFieldContainer.style.display = "none";
      popup.style.display = "flex";
    });
  });
});