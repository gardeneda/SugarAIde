const navLinks = [
    { name: "Profile", link: "/profile" },
    { name: "Exercise", link: "/exercisePage" },
    { name: "Diet", link: "/dietTrack" },
    { name: "Risk", link: "/risk" },
    { name: "Chat", link: "/chat" }
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
  