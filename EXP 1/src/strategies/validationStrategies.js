// Strategy Design Pattern
// Each platform owns its own limit + validate function so adding a new
// platform never requires touching a conditional chain elsewhere in the app.

export const platformStrategies = {
  twitter: {
    label: "Twitter / X",
    limit: 280,
    hashtags: false,
    validate: (text) => {
      if (!text.trim()) return "Post content cannot be empty";
      if (text.length > 280) return `Exceeds Twitter limit by ${text.length - 280} characters`;
      return null;
    },
  },
  linkedin: {
    label: "LinkedIn",
    limit: 3000,
    hashtags: false,
    validate: (text) => {
      if (!text.trim()) return "Post content cannot be empty";
      if (text.length > 3000) return `Exceeds LinkedIn limit by ${text.length - 3000} characters`;
      return null;
    },
  },
  instagram: {
    label: "Instagram",
    limit: 2200,
    hashtags: true,
    validate: (text) => {
      if (!text.trim()) return "Caption cannot be empty";
      if (text.length > 2200) return `Exceeds Instagram caption limit by ${text.length - 2200} characters`;
      const hashtagCount = (text.match(/#[\w]+/g) || []).length;
      if (hashtagCount > 30) return `Instagram allows max 30 hashtags (found ${hashtagCount})`;
      return null;
    },
  },
};

// Adding a new platform = adding one more key here. Nothing else in the
// app needs to change (open/closed principle).
export function getStrategy(platform) {
  return platformStrategies[platform];
}

export function validateForPlatform(platform, text) {
  const strategy = getStrategy(platform);
  if (!strategy) return "Unknown platform";
  return strategy.validate(text);
}
