// /api/cloudinary-sign.js
//
// এই ফাইলটা আপনার প্রজেক্টের রুটে থাকা "api" ফোল্ডারে বসাতে হবে
// (যদি আগে থেকে "api" ফোল্ডার না থাকে, নতুন বানিয়ে নিন)।
// Vercel এই ফাইলটা স্বয়ংক্রিয়ভাবে /api/cloudinary-sign নামে একটা endpoint বানিয়ে দেবে।
//
// কাজ: ব্রাউজার থেকে একটা request আসে (কোন ফোল্ডারে আপলোড হবে সেটা জানিয়ে),
// এই ফাংশন CLOUDINARY_API_SECRET (যেটা শুধু Vercel-এর environment variable-এ
// থাকে, কখনো ব্রাউজারে যায় না) দিয়ে একটা "signature" বানিয়ে ফেরত পাঠায়।
// ব্রাউজার সেই signature দিয়ে সরাসরি Cloudinary-তে আপলোড করে।

const crypto = require("crypto");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { folder } = req.body || {};

    if (!folder || typeof folder !== "string") {
      res.status(400).json({ error: "folder is required" });
      return;
    }

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiKey || !apiSecret || !cloudName) {
      res.status(500).json({ error: "Cloudinary env vars not configured on server" });
      return;
    }

    const timestamp = Math.round(Date.now() / 1000);

    // Cloudinary-র নিয়ম: sign করার জন্য parameter গুলো alphabetically sort করে
    // "key=value&key2=value2" আকারে string বানিয়ে শেষে API_SECRET জুড়ে SHA-1 hash নিতে হয়।
    const paramsToSign = { folder, timestamp };
    const sortedKeys = Object.keys(paramsToSign).sort();
    const toSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join("&");

    const signature = crypto
      .createHash("sha1")
      .update(toSign + apiSecret)
      .digest("hex");

    res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err) {
    console.error("cloudinary-sign error:", err);
    res.status(500).json({ error: "Internal error generating signature" });
  }
};
