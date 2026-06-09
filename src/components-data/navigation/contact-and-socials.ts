export const SOCIAL_LINKS = {
  FACEBOOK: {
    label: "Facebook",
    href: "https://web.facebook.com/qavtixhq",
    icon: "ri:facebook-fill"
  },
  TWITTER: {
    label: "Twitter",
    href: "https://x.com/qavtixhq",
    icon: "streamline-logos:x-twitter-logo-solid"
  },
  INSTAGRAM: {
    label: "Instagram",
    href: "https://www.instagram.com/qavtixhq/",
    icon: "mdi:instagram"
  },
} as const

export const ADDITIONAL_SOCIAL_LINKS = {
  LINKEDIN: {
    label: "Linkedin",
    href: "https://www.linkedin.com/company/qavtixhq/",
    icon: "ri:linkedin-fill"
  },
  TIKTOK: {
    label: "TikTok",
    href: "https://www.tiktok.com/@qavtixhq",
    icon: "ic:baseline-tiktok"
  },
} as const



export const CONTACT_LINKS = {
  LAGOS: {
    LOCATION: {
      icon: "hugeicons:location-06",
      text: "Lagos, Nigeria.",
      href: null
    },
    EMAIL: {
      icon: "mynaui:mail",
      text: "info@qavtix.com",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=info@qavtix.com"
    },
    PHONE: {
      icon: "fluent-mdl2:phone",
      text: "+234 812 345 6789",
      href: "tel:+2348123456789"
    }
  } as const,


  ABUJA: {
    LOCATION: {
      icon: "hugeicons:location-06",
      text: "Abuja, Nigeria.",
      href: null
    },
    EMAIL: {
      icon: "mynaui:mail",
      text: "info@qavtix.com",
      href: "mailto:info@qavtix.com"
    },
    PHONE: {
      icon: "fluent-mdl2:phone",
      text: "+234 803 429 9410",
      href: "tel:+2348034299410"
    }
  },


  LAGOS_MAPEMBED: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.62283084026!2d3.281290!3d6.524379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1234567890',
  ABUJA_MAPEMBED: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.02587508693!2d7.398574!3d9.057650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0baf7da48d0d%3A0x99a8fe4168c50bc8!2sAbuja%2C%20Nigeria!5e0!3m2!1sen!2s!4v1234567890'


} as const

export const SUPPORT_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" }
] as const;
