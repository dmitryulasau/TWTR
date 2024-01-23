import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB31YYufPztGZMv1Ciua3FTzg9TnK7VhVc",
  authDomain: "twitterq-c058a.firebaseapp.com",
  projectId: "twitterq-c058a",
  storageBucket: "twitterq-c058a.appspot.com",
  messagingSenderId: "439934580196",
  appId: "1:439934580196:web:a94660ac927600bee103f1",
};
function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const signupForm = document.querySelector("#signup-form");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // GET USER INFO
    const email = signupForm["email-input-signup"].value;
    const password = signupForm["password-input-signup"].value;

    try {
      // SIGN UP USER
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const notification = document.getElementById("notifications");
      const singUpHeading = document.getElementById("singup-heading");
      const singUpFooter = document.getElementById("singup-footer");

      signupForm.style.display = "none";
      singUpFooter.style.display = "none";
      notification.style.display = "block";
      notification.style.top = "54%";
      singUpHeading.textContent = "Please Sign In";

      notification.textContent = "Registration Complete!";

      clearForm();
    } catch (error) {
      console.error("Error creating user:", error.message);

      const notification = document.getElementById("notifications");
      notification.style.display = "block";
      if (error.message == "Firebase: Error (auth/email-already-in-use).") {
        notification.textContent = `Already registered!`;
      } else if (
        error.message ==
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        notification.textContent = `Minimum 6 characters.`;
      } else {
        notification.textContent = `Something wrong`;
      }
    }
  });
}

function clearForm() {
  const signupForm = document.querySelector("#signup-form");
  signupForm.reset();
}

initializeFirebase();
