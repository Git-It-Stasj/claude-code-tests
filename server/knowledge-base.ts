interface KBSection {
  policy?: string;
  steps?: string[];
  domestic?: string;
  international?: string;
  express?: string;
  freeThreshold?: string;
  standard?: string;
  categories?: string[];
  materials?: string;
  sizing?: string;
  methods?: string;
  invoicing?: string;
  refunds?: string;
  hours?: string;
  email?: string;
  response?: string;
}

const KB: Record<string, KBSection> = {
  return: {
    policy:
      "Forge Shop offers 30-day returns on all items. Return shipping is free on orders over $50. Items must be in original condition with tags attached.",
    steps: [
      "1. Email support@forgeshop.com with your order number",
      "2. We'll send a prepaid return label within 24 hours",
      "3. Pack item securely and drop off at any carrier location",
      "4. Refund processed within 3-5 business days of receipt",
    ],
  },
  shipping: {
    domestic: "Standard shipping 5-7 business days ($4.99). Express 2-day shipping available ($12.99). Free standard shipping on orders over $75.",
    international: "International shipping 7-14 business days. Rates calculated at checkout. Customs/duties are customer's responsibility.",
    express: "2-day express shipping available for $12.99. Order by 2pm ET for same-day dispatch.",
    freeThreshold: "Free standard shipping on all domestic orders over $75.",
    standard: "Standard shipping: 5-7 business days for $4.99.",
  },
  product: {
    categories: ["electronics accessories", "home goods", "apparel"],
    materials: "All materials listed on product pages. Electronics accessories come with 1-year warranty.",
    sizing: "Size guides available on each apparel product page. We recommend measuring and comparing to our size chart.",
  },
  billing: {
    methods: "We accept Visa, Mastercard, Amex, Discover, and PayPal. All transactions are SSL encrypted.",
    invoicing: "Invoices sent within 24 hours of order confirmation to the email on file.",
    refunds: "Refunds appear on your statement within 5-7 business days. PayPal refunds are instant.",
  },
  general: {
    hours: "Customer support available Monday-Friday, 9am-5pm ET.",
    email: "support@forgeshop.com",
    response: "We respond to all emails within 24 business hours.",
  },
};

export function lookupKB(intent: string): string {
  const section = KB[intent] || KB.general;
  return Object.entries(section)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.join("\n")}`;
      }
      return `${key}: ${value}`;
    })
    .join("\n\n");
}

export { KB };
