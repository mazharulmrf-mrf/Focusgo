# FocusGo

## ধাপে ধাপে কী করবেন

### ১. GitHub-এ আপলোড
এই পুরো ফোল্ডারটা একটা নতুন GitHub repository-তে push করুন।

### ২. Google Sign-In চালু করা (Firebase)
1. https://console.firebase.google.com এ যান, নতুন প্রজেক্ট বানান (ফ্রি)।
2. বাম পাশে **Build > Authentication** এ ক্লিক করুন > "Get started"।
3. **Sign-in method** ট্যাবে গিয়ে **Google** অন করুন।
4. **Project settings (⚙️) > General** এ যান, নিচে "Your apps" এ **Web app (</>)** যোগ করুন।
5. যে config অবজেক্ট (apiKey, authDomain ইত্যাদি) দেখাবে, সেগুলো কপি করুন।

### ৩. Key গুলো বসানো
- এই ফোল্ডারে `.env.example` ফাইলের নাম বদলে `.env` করুন।
- Firebase থেকে পাওয়া মানগুলো `.env` ফাইলে বসান। যেমন:
  ```
  VITE_FIREBASE_API_KEY=AIzaSy...
  VITE_FIREBASE_AUTH_DOMAIN=yourapp.firebaseapp.com
  ...
  ```
- `.env` ফাইলটা কখনও GitHub-এ আপলোড হবে না (এটা `.gitignore`-এ আগে থেকেই বাদ দেওয়া আছে) — এটা নিরাপত্তার জন্য।

### ৪. লোকালি রান করা (টেস্ট করার জন্য)
```
npm install
npm run dev
```

### ৫. ইন্টারনেটে হোস্ট করা (Deploy)
- [Vercel](https://vercel.com) এ গিয়ে GitHub দিয়ে লগইন করুন।
- আপনার repo সিলেক্ট করে "Import" করুন।
- Vercel-এর সেটিংসে গিয়ে Environment Variables-এ `.env`-এর মতো একই key-value গুলো বসান।
- Deploy করুন — একটা লিংক পাবেন, যেমন `focusgo.vercel.app`।

### ৬. শেষ ধাপ (জরুরি)
- Firebase Console > Authentication > Settings > **Authorized domains** এ গিয়ে আপনার Vercel লিংকটা (যেমন `focusgo.vercel.app`) যোগ করুন। এটা না করলে Sign-in কাজ করবে না।

## নোট
`src/App.jsx` ফাইলের `GoogleAuthButton` অংশে আসল Firebase sign-in বসানো আছে (আগে যেটা শুধু preview button ছিল)। Config ঠিকমতো বসালেই এটা কাজ করবে।
