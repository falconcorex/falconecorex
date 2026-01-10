// ===== Firebase App Initialization =====
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAvkfB_D5dQ-lZOaDZZS-Fc57MfN9bQhE",
  authDomain: "falconcorex-b2ac7.firebaseapp.com",
  projectId: "falconcorex-b2ac7",
  storageBucket: "falconcorex-b2ac7.firebasestorage.app",
  messagingSenderId: "784095375894",
  appId: "1:784095375894:web:81ec9ee13677fa12943b37",
  measurementId: "G-YCF5KEER2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ===== Auth Functions =====
export function login() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Logged in as:", result.user.displayName);
      alert(`مرحباً ${result.user.displayName}!`);
    })
    .catch((error) => console.error(error));
}

export function logout() {
  signOut(auth)
    .then(() => alert("تم تسجيل الخروج بنجاح"))
    .catch((error) => console.error(error));
}

// ===== Comments Functions =====

// إضافة تعليق
export async function addComment(postId, text) {
  if (!text) return alert("اكتب تعليقك أولاً!");
  if (!auth.currentUser) return alert("سجّل دخولك أولاً!");

  try {
    await addDoc(collection(db, "comments", postId, "items"), {
      name: auth.currentUser.displayName,
      photo: auth.currentUser.photoURL,
      text: text,
      date: serverTimestamp()
    });
  } catch (err) {
    console.error("Error adding comment:", err);
  }
}

// تحميل التعليقات وعرضها
export function loadComments(postId, containerId) {
  const commentsRef = collection(db, "comments", postId, "items");
  const q = query(commentsRef, orderBy("date", "desc"));

  onSnapshot(q, (snapshot) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    snapshot.forEach(docSnap => {
      const c = docSnap.data();
      container.innerHTML += `
        <div class="comment">
          <img src="${c.photo}" alt="${c.name}">
          <div>
            <strong>${c.name}</strong>
            <p>${c.text}</p>
          </div>
        </div>
      `;
    });
  });
}
