// 🔐 PROTECT DASHBOARD
if (window.location.pathname.includes("dashboard.html")) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "register.html";
    } else {
        getMoods();
    }
}
// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email === "" || password === "") {
            alert("All fields are required");
            return;
        }

        const submitBtn = loginForm.querySelector("button[type='submit']");
        submitBtn.innerText = "Logging in... (Server waking up, may take 50s)";
        submitBtn.disabled = true;

        try {
            const res = await fetch("https://mindmatter-jzke.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("Login successful");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Error connecting to server. If it's your first try, the server might be waking up. Please try again.");
        } finally {
            submitBtn.innerText = "Login";
            submitBtn.disabled = false;
        }
    });
}

// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const submitBtn = registerForm.querySelector("button[type='submit']");
        submitBtn.innerText = "Registering... (Server waking up, may take 50s)";
        submitBtn.disabled = true;

        try {
            const res = await fetch("https://mindmatter-jzke.onrender.com/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();
            alert(data.message);

        } catch (error) {
            console.log(error);
            alert("Error connecting to server. If it's your first try, the server might be waking up. Please try again.");
        } finally {
            submitBtn.innerText = "Register";
            submitBtn.disabled = false;
        }
    });
}

// ================= DASHBOARD FUNCTION =================
async function getDashboard() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("https://mindmatter-jzke.onrender.com/dashboard", {
            headers: {
                Authorization: token
            }
        });

        const data = await res.json();
        alert(data.message);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
// ================= MOOD TRACKER =================
async function addMood() {
    const mood = document.getElementById("mood").value;
    const note = document.getElementById("note").value;

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    try {
        const res = await fetch("https://mindmatter-jzke.onrender.com/addMood", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ mood, note })
        });

        console.log("Status:", res.status);

        const data = await res.json();
        console.log("Response:", data);

        alert(data.message);

        getMoods();

    } catch (error) {
        console.log("Error:", error);
    }
}

async function getMoods() {
    const token = localStorage.getItem("token");

    const res = await fetch("https://mindmatter-jzke.onrender.com/getMoods", {
        headers: {
            "Authorization": token
        }
    });

    const data = await res.json();

    const list = document.getElementById("moodList");
    list.innerHTML = "";

    data.forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
        Mood: ${item.mood} | Note: ${item.note}
        <button onclick="editMood('${item._id}', '${item.mood}', '${item.note}')">Edit</button>
        <button onclick="deleteMood('${item._id}')">Delete</button>
    `;

    list.appendChild(li);
});

}

async function deleteMood(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://mindmatter-jzke.onrender.com/deleteMood/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: token
        }
    });

    const data = await res.json();
    alert(data.message);

    getMoods(); // refresh list
}
async function updateMood(id, mood, note) {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://mindmatter-jzke.onrender.com/updateMood/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ mood, note })
    });

    const data = await res.json();
    alert(data.message);

    getMoods();
}
function editMood(id, oldMood, oldNote) {
    const newMood = prompt("Edit mood:", oldMood);
    const newNote = prompt("Edit note:", oldNote);

    if (!newMood || !newNote) return;

    updateMood(id, newMood, newNote);
}
function logout() {
    localStorage.removeItem("token");
    alert("Logged out");
    window.location.href = "index.html";
}   
// AUTO LOAD MOODS WHEN PAGE OPENS
if (window.location.pathname.includes("dashboard.html")) {
    getMoods();
}