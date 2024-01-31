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
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";
const firebaseConfig = {
  apiKey: "AIzaSyB31YYufPztGZMv1Ciua3FTzg9TnK7VhVc",
  authDomain: "twitterq-c058a.firebaseapp.com",
  projectId: "twitterq-c058a",
  storageBucket: "twitterq-c058a.appspot.com",
  messagingSenderId: "439934580196",
  appId: "1:439934580196:web:a94660ac927600bee103f1",
};

let currentUser;
let db;

function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  db = getFirestore(app);
  const storage = getStorage(app);

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
      // console.log("USER LOGGED IN", user);
      profileNick.textContent = "@" + user.email.split("@")[0];

      currentUser = user.email.split("@")[0];
      console.log(currentUser);
      updateTweets();
    } else {
      setupUI();
      // console.log("USER LOGGED OUT");
      // console.log(currentUser);
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

  // CREATE TWEET
  const createForm = document.getElementById("create-form");

  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = createForm["tweetContent"].value;
    const imageInput = createForm["imageInput"];
    const created = serverTimestamp();

    const previewContainer = document.getElementById("preview-container");

    if (imageInput.files.length > 0) {
      const imageFile = imageInput.files[0];
      const storageRef = ref(storage, `images/${imageFile.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);

        const userEmail = auth.currentUser.email;

        await addDoc(collection(db, "tweets"), {
          content,
          image: imageUrl,
          created,
          userId: userEmail,
        });

        // Reset the form to clear all fields, including the file input
        createForm.reset();
        previewContainer.style.display = "none";
        imageInput.value = "";
        updateTweets();
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    } else {
      const userEmail = auth.currentUser.email;

      await addDoc(collection(db, "tweets"), {
        content,
        created,
        userId: userEmail,
      });

      // Reset the form to clear all fields, including the file input
      createForm.reset();
      previewContainer.style.display = "none";
      imageInput.value = "";
      updateTweets();
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
  data.sort((a, b) => b.data().created - a.data().created);

  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const tweet = doc.data();
      const tweetId = doc.id;
      // console.log(tweet);

      const imageHTML = tweet.image
        ? `<img class="tweet__image" src="${tweet.image}" alt="Tweet Image"/>`
        : "";

      const li = `
      <div class="tweet">
      <img
        class="tweet__author-logo"
        src=${noAvatar}
        alt="no avatar"
      />
      <div class="tweet__main">
  
        <div class="tweet__header-container">
        <div class="tweet__header">
          <div class="tweet__author-name">
            ${tweet.userId.split("@")[0].toUpperCase()}
          </div>
          <div class="tweet__author-slug">@${tweet.userId.split("@")[0]}</div>
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
        <div class="tweet__control">
        
        <div class="control-button button-edit">
          <ion-icon name="pencil-outline"></ion-icon>
        </div>
        <div class="control-button button-delete" data-tweet-id="${tweetId}">
        <ion-icon name="trash-outline"></ion-icon>
        </div>
      </div>
        </div>

        
          <div class="tweet__content">${tweet.content}</div>
          <div>
          <div>${imageHTML}</div>
          </div>
  
      </div>
    </div>
      `;

      html += li;

      tweetsList.innerHTML = html;

      addDeleteButtonListeners();
    });
  } else {
    tweetsList.innerHTML = "<h2>NO TWEETS YET</h2>";
  }
};

function addDeleteButtonListeners() {
  const deleteButtons = document.querySelectorAll(".button-delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const tweetId = button.getAttribute("data-tweet-id");
      await deleteTweet(tweetId);
      updateTweets();
    });
  });
}

// DELETE TWEET

async function deleteTweet(tweetId) {
  try {
    const tweetDocRef = doc(db, "tweets", tweetId);
    await deleteDoc(tweetDocRef);
    console.log("Tweet deleted successfully");
  } catch (error) {
    console.error("Error deleting tweet:", error);
  }
}

function updateTweets() {
  const tweetsCollection = collection(db, "tweets");

  getDocs(tweetsCollection)
    .then((snapshot) => {
      setupTweets(snapshot.docs);
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}
