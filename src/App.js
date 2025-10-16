import React, { useEffect, useState } from "react";
import liff from "@line/liff";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.REACT_APP_LIFF_ID });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        }
      } catch (err) {
        console.error("LIFF init failed:", err);
      }
    };

    initLiff();
  }, []);

  const handleSendMessage = async () => {
    await liff.sendMessages([
      {
        type: "text",
        text: `Hello, ${profile.displayName}! 👋`
      }
    ]);
    alert("ข้อความถูกส่งไปใน LINE แล้ว!");
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
