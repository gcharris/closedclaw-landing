// Beta Signup Modal
// API endpoint - change this for production
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://closedclaw.kogn.ist';

function openModal() {
    const modal = document.getElementById('signup-modal');
    const form = document.getElementById('signup-form');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    // Reset state
    if (form) form.classList.remove('hidden');
    if (successMsg) successMsg.classList.add('hidden');
    if (errorMsg) errorMsg.classList.add('hidden');
    if (form) form.reset();

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeModal() {
    const modal = document.getElementById('signup-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scroll
}

async function submitApplication(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const data = {
        display_name: form.display_name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim() || null,
        product_interest: form.product_interest.value,
    };

    try {
        const response = await fetch(`${API_BASE}/api/v1/onboarding/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Success - show success message
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
        } else if (response.status === 409) {
            // Duplicate email
            errorText.textContent = 'An application has already been submitted with this email address.';
            form.classList.add('hidden');
            errorMsg.classList.remove('hidden');
        } else if (response.status === 422) {
            // Validation error
            const errorData = await response.json();
            const detail = errorData.detail;
            if (Array.isArray(detail) && detail.length > 0) {
                errorText.textContent = detail[0].msg || 'Please check your input and try again.';
            } else {
                errorText.textContent = 'Please check your input and try again.';
            }
            form.classList.add('hidden');
            errorMsg.classList.remove('hidden');
        } else {
            // Other error
            errorText.textContent = 'Something went wrong. Please try again later.';
            form.classList.add('hidden');
            errorMsg.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Signup error:', error);
        errorText.textContent = 'Network error. Please check your connection and try again.';
        form.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade-in elements
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-visual, .comparison-section, .workflow-content, .spec-card, .pitch-content');

    // Add initial styles for animation
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Wire up CTA buttons to open modal
    // "Get Access" in nav
    document.querySelectorAll('a[href="#contact"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // "Initialize Safe Harbor" button in footer
    document.querySelectorAll('.pitch-content .btn-primary.large').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Close modal on backdrop click
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'signup-modal') closeModal();
        });
    }

    // Smooth Scroll for Anchor Links (except #contact which opens modal)
    document.querySelectorAll('a[href^="#"]:not([href="#contact"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Button Hover Tone Effect (Sound simulation placeholder)
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Future: Play subtle haptic/sound
        });
    });
});
