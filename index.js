const loginBtn = document.getElementById("login-button");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      location.reload();
    } else {
      alert("Login failed!");
    }
  });
}

// Navbar toggle (unchanged)
const isLoggedIn = !!localStorage.getItem("token");
document.getElementById("guest-links").style.display = isLoggedIn ? "none" : "inline";
document.getElementById("user-links").style.display  = isLoggedIn ? "inline" : "none";

const logoutBtn = document.getElementById("logout-button");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    location.reload();
  });
}
