function showNotification() {
  const notification = document.getElementById("notifications");
  notification.style.display = "block";
  notification.textContent = "Minimum 6 characters";
}

function hideNotification() {
  const notification = document.getElementById("notifications");
  notification.style.display = "none";
}

function hideNotificationLogin() {
  const notification = document.getElementById("notifications-login");
  notification.style.display = "none";
}

function checkPasswordLength() {
  const passwordInput = document.getElementById("password-input-signup");
  const notification = document.getElementById("notifications");
  if (passwordInput.value.length < 6) {
    notification.style.display = "block";
  } else {
    notification.style.display = "none";
  }
}

function checkPasswordMatch() {
  const passwordInput = document.getElementById("password-input-signup");
  const confirmPasswordInput = document.getElementById(
    "password-input-confirm"
  );
  const notification = document.getElementById("notifications");

  if (passwordInput.value !== confirmPasswordInput.value) {
    notification.style.display = "block";
    notification.textContent = "Passwords do not match";
  } else {
    notification.style.display = "none";
  }
}

function clearForm() {
  const signupForm = document.querySelector("#signup-form");
  const loginForm = document.querySelector("#login-form");
  loginForm.reset();
  signupForm.reset();
}

function createDefault() {
  const signupForm = document.querySelector("#signup-form");
  const notification = document.getElementById("notifications");
  const singUpHeading = document.getElementById("singup-heading");
  const singUpFooter = document.getElementById("singup-footer");

  notification.style.top = "24%";
  signupForm.style.display = "flex";
  singUpFooter.style.display = "block";
  notification.style.display = "none";
  singUpHeading.textContent = "Create your account";

  clearForm();
}

const homePage = document.getElementById("main");
const tweeterPage = document.getElementById("tweeter");
const setupUI = (user) => {
  if (user) {
    homePage.style.display = "none";
    tweeterPage.style.display = "flex";
  } else {
    homePage.style.display = "flex";
    tweeterPage.style.display = "none";
  }
};

// CREATE TWEET
document.getElementById("imageInput").addEventListener("change", function () {
  previewImage(this);
});

function previewImage(input) {
  const previewContainer = document.getElementById("preview-container");
  const previewImage = document.getElementById("previewImage");

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewContainer.style.display = "block";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function cancelUpload() {
  const previewContainer = document.getElementById("preview-container");
  const imageInput = document.getElementById("imageInput");

  previewContainer.style.display = "none";
  imageInput.value = ""; // Clear the file input value
}
