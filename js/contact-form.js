/**
 * Contact Form Handler for Alex Rodriguez Portfolio
 * Handles form submission, validation, and user feedback
 */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.newsletterForm = document.getElementById('newsletter-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupContactForm();
        }
        if (this.newsletterForm) {
            this.setupNewsletterForm();
        }
    }

    setupContactForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmission();
        });

        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupNewsletterForm() {
        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmission();
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Select validation
        if (field.tagName === 'SELECT' && (value === '-' || !value)) {
            isValid = false;
            errorMessage = 'Please select an option';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorMessage = field.parentNode.querySelector('.invalid-feedback');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleContactSubmission() {
        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please correct the errors above.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            // Since this is a static site, we'll simulate the submission
            // In a real implementation, you would send this to your backend
            await this.simulateFormSubmission(data);

            // Show success message
            this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.form.reset();

            // Track the form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'Contact',
                    event_label: 'Contact Form'
                });
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleNewsletterSubmission() {
        const emailInput = this.newsletterForm.querySelector('input[type="email"]');
        const submitBtn = this.newsletterForm.querySelector('button[type="submit"]');
        
        if (!this.validateField(emailInput)) {
            return;
        }

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            // Simulate newsletter subscription
            await this.simulateNewsletterSubmission(emailInput.value);
            
            this.showMessage('Thanks for subscribing! You\'ll receive updates about new projects.', 'success');
            this.newsletterForm.reset();

            // Track the subscription
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'Newsletter',
                    event_label: 'Footer Signup'
                });
            }

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showMessage('Sorry, there was an error with your subscription. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateFormSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log the form data (in production, this would be sent to your backend)
        console.log('Contact form submission:', data);
        
        // You could integrate with services like:
        // - Netlify Forms
        // - Formspree
        // - EmailJS
        // - Your own backend API
    }

    async simulateNewsletterSubmission(email) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Log the subscription (in production, this would be sent to your email service)
        console.log('Newsletter subscription:', email);
        
        // You could integrate with services like:
        // - Mailchimp
        // - ConvertKit
        // - Sendinblue
        // - Your own backend API
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;

        // Insert message after the form
        const targetForm = this.form || this.newsletterForm;
        targetForm.parentNode.insertBefore(messageDiv, targetForm.nextSibling);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});

// Export for use in other scripts
window.ContactFormHandler = ContactFormHandler;
