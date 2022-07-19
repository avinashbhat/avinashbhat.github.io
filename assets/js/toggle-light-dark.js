const btn = document.getElementById("toggle-dark-light");

let toggleIcon = btn.firstElementChild;

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
btn.addEventListener("click", function () {
    if (prefersDarkScheme.matches) {
      	document.body.classList.toggle("light-theme");
      	var theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
      toggleIconFn(theme);
    } else {
    	document.body.classList.toggle("dark-theme");
      	var theme = document.body.classList.contains("dark-theme")
					? "dark"
					: "light";
      	toggleIconFn(theme);
    }
    localStorage.setItem("theme", theme);
  });

    const toggleIconFn = (theme) => {
    if (theme === "dark") {
      toggleIcon.className = "fa-solid fa-sun";
    } else {
      toggleIcon.className = "fa-solid fa-moon";
    }
  };
