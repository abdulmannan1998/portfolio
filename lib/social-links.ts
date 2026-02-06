export const SOCIAL_LINKS = {
  github: {
    url: "https://github.com/abdulmannan1998",
    username: "abdulmannan1998",
  },
  linkedin: {
    url: "https://www.linkedin.com/in/mannan-abdul-0601a2192/",
  },
  email: {
    address: "abdul.1998.17@gmail.com",
    mailto: "mailto:abdul.1998.17@gmail.com",
  },
} as const;

export type SocialLinks = typeof SOCIAL_LINKS;
