
(function () {
  emailjs.init({
    publicKey: "YOUR_PUBLIC_KEY", // Replace with your EmailJS public key   
   
  });
})();

// Get IP Address
async function getIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org");

    if (!response.ok) {
      throw new Error("Unable to fetch IP address");
    }

    const ip = await response.text();
    console.log("IP:", ip);
    return ip;
  } catch (error) {
    console.error("IP fetch failed:", error);
    return null;
  }
}

// Form Submit
const handleFormSubmit = async (formId) => {
  const form = document.getElementById(formId);

  if (!form) return;

  // Prevent submission if native HTML validation fails
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".status");
  const originalButtonHTML = submitButton?.innerHTML;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  if (status) {
    status.textContent = "";
  }

  // Get values directly from the submitted form
  const formData = new FormData(form);

  const templateParams = {
    user_name: formData.get("full_name") || "",
    user_email: formData.get("email") || "",
    contact_number: formData.get("phone") || "",
    requirement: formData.get("requirement") || "Not specified",
    privacy_check: form.querySelector(
      'input[type="checkbox"]'
    )?.checked ? "Agreed" : "Not agreed",

    ip_address: await getIpAddress(),
    website_url: window.location.href,

    to_email: "YOUR_EMAIL_ADDRESS", // Replace with your email address
    company_name: "147 Green",
    date: new Date().toLocaleDateString("en-GB"),
    cc_email: "YOUR_CC_EMAIL_ADDRESS", // Replace with your CC email address

    form_type: formId === "contact-form"
      ? "Main Enquiry Form"
      : "Modal Popup Form"
  };

  try {
    // Send Email using EmailJS
    const response = await emailjs.send(
      "contact_service",
      "contact_form",
      templateParams
    );

    console.log("SUCCESS!", response.status, response.text);

    if (response.status === 200) {
      form.reset();
      window.location.href = "thank-you.html";
    }
  } catch (error) {
    console.error("FAILED...", error);

    if (status) {
      status.textContent =
        "Message not sent. Please try again.";
    } else {
      alert("Message not sent. Please try again.");
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  }
};

// Form Event Listeners
window.addEventListener("DOMContentLoaded", function () {
  // Main Enquiry Form
  document.getElementById("contact-form")?.addEventListener
  ("submit", function (event) {
      event.preventDefault();
      handleFormSubmit("contact-form");
    });

  // Modal Popup Form
  document.getElementById("contact-form-modal")
    ?.addEventListener("submit", function (event) {
      event.preventDefault();
      handleFormSubmit("contact-form-modal");
    });
});
