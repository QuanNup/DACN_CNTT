export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Projects",
      href: "/",
    },
    {
      label: "Team",
      href: "/",
    },
    {
      label: "Calendar",
      href: "/",
    },
    {
      label: "Settings",
      href: "/",
    },
    {
      label: "Help & Feedback",
      href: "/",
    },
    {
      label: "signOut",
      href: "#",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
