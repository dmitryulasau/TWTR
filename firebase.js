import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB31YYufPztGZMv1Ciua3FTzg9TnK7VhVc",
  authDomain: "twitterq-c058a.firebaseapp.com",
  projectId: "twitterq-c058a",
  storageBucket: "twitterq-c058a.appspot.com",
  messagingSenderId: "439934580196",
  appId: "1:439934580196:web:a94660ac927600bee103f1",
};

let currentUser;

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
    const confirmPassword = signupForm["password-input-confirm"].value;

    if (password !== confirmPassword) {
      const notification = document.getElementById("notifications");
      notification.style.display = "block";
      notification.textContent = "Passwords do not match";
      return;
    }

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

  // GET DATA

  const tweetsCollection = collection(db, "tweets");

  getDocs(tweetsCollection)
    .then((snapshot) => {
      setupTweets(snapshot.docs);
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });

  // AUTH STATE
  auth.onAuthStateChanged((user) => {
    setupUI(user);
    const profileNick = document.getElementById("profile-nick");

    if (user) {
      console.log("USER LOGGED IN", user);
      profileNick.textContent = "@" + user.email.split("@")[0];

      currentUser = user.email.split("@")[0];
    } else {
      setupUI();
      console.log("USER LOGGED OUT");
      console.log(currentUser);
    }
  });

  // LOGOUT
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", (e) => {
    e.preventDefault();

    auth.signOut();
    currentUser = null;
  });

  // LOGIN
  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // GET USER INFO
    const emailLogin = loginForm["email-input"].value;
    const passwordLogin = loginForm["password-input"].value;

    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        emailLogin,
        passwordLogin
      );

      const closeButton = document.querySelector(
        "#logInModal button[data-bs-dismiss='modal']"
      );
      if (closeButton) {
        closeButton.click();
      }

      clearForm();
    } catch (error) {
      console.error("Error creating user:", error.message);

      const notification = document.getElementById("notifications-login");
      notification.style.display = "block";
      if (error.message == "Firebase: Error (auth/invalid-credential).") {
        notification.textContent = `Wrong email/password combo`;
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

// TWEETERS
const tweetsList = document.getElementById("tweeter-field");
const noAvatar =
  "https://res.cloudinary.com/dulasau/image/upload/v1661875818/noAvatar_wdsdee.png";
const setupTweets = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const tweet = doc.data();
      console.log(tweet);
      const li = `
      <div class="tweet">
      <img
        class="tweet__author-logo"
        src=${noAvatar}
        alt="no avatar"
      />
      <div class="tweet__main">
  
        <div class="tweet__header">
          <div class="tweet__author-name">
            ${currentUser}
          </div>
          <div class="tweet__author-slug">@${currentUser}</div>
          <div class="tweet_dot">-</div>
          <div class="tweet__publish-time">${tweet.created
            .toDate()
            .toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}</div>
        </div>
  
          <div class="tweet__content">${tweet.content}</div>
          <div>
          <img
          class="tweet__image"
          src="https://res.cloudinary.com/dulasau/image/upload/v1706491692/tweet_1_zdwmg4.jpg"
          alt="Friends TV Show"
        /></div>
  
      </div>
    </div>
      `;

      html += li;

      tweetsList.innerHTML = html;
    });
  } else {
    tweetsList.innerHTML = "<h2>NO TWEETS YET</h2>";
  }
};
