const navLinks = [
    { name: "Profile", link: "/profile" },
    { name: "Exercise", link: "/exercisePage" },
    { name: "Diet", link: "/checkCalories" },
    { name: "FoodLog", link: "/foodHistory" },
    { name: "Risk", link: "/risk" },
    { name: "Chat", link: "/chat" },
    { name: "Additional Resources", link: "/additionalInfo" }
  ];
  
function highlightCurrentLink(pathname) {
    return navLinks.map((navLink) => {
      if (navLink.link === pathname) {
        return { ...navLink, isActive: true};
      } else {
        return { ...navLink, isActive: false};
      }
    });
  }

  module.exports = { navLinks, highlightCurrentLink };
  