export const SOCIAL_LINKS = {
  github: {
    url: "https://github.com/USERNAME",
    username: "USERNAME",
  },
  linkedin: {
    url: "https://linkedin.com/in/USERNAME",
  },
  email: {
    address: "email@example.com",
    mailto: "mailto:email@example.com",
  },
} as const;

export type SocialLinks = typeof SOCIAL_LINKS;
