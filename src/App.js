import React, { useEffect, useState } from "react";
import liff from "@line/liff";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
        if (!liff.isLoggedIn()) {
          liff.login(); // login ใหม่เพื่อให้สิทธิ์ใหม่มีผล
        } else {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        }
      } catch (err) {
        console.error("LIFF init failed:", err);
      }
    };
  
    // ✅ บังคับ logout ก่อน init เพื่อเคลียร์ token เก่า
    liff.logout();
    window.location.reload();
    initLiff();
  }, []);
  

  const handleSendMessage = async () => {
    try {
      await liff.sendMessages([
        { type: "text", text: `Hello, ${profile.displayName}! 👋` }
      ]);
      alert("ส่งข้อความสำเร็จ!");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("ไม่สามารถส่งข้อความได้: " + err.message);
    }
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {profile ? (
        <>
          <img
            src={profile.pictureUrl}
            alt="profile"
            style={{ borderRadius: "50%", width: "100px" }}
          />
          <h2>{profile.displayName}</h2>
          <p>{profile.statusMessage}</p>
          <button onClick={handleSendMessage}>ส่งข้อความ</button>
        </>
      ) : (
        <p>กำลังโหลดข้อมูลจาก LINE...</p>
      )}
    </div>
  );
}

export default App;
