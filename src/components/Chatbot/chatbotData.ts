export type ChatQuickAction = {
  label: string;
  message: string;
};

export const WELCOME_MESSAGE = `Hi! 👋 Welcome to Anamritam.

I'm here to help you explore our wholesome range of ladoos, protein bars and Nutri Bites.

What would you like to know?`;

export const MAIN_QUICK_ACTIONS: ChatQuickAction[] = [
  { label: 'Explore Products', message: 'What products do you have?' },
  { label: 'Mahua Ladoos', message: 'What ladoos do you have?' },
  { label: 'Protein Bars', message: 'What protein bars do you have?' },
  { label: 'Nutri Bites', message: 'Tell me about Nutri Bites' },
  { label: 'How to Order', message: 'How do I order?' },
  { label: 'Contact Us', message: 'How can I contact you?' },
];

export const LADOO_QUICK_ACTIONS: ChatQuickAction[] = [
  { label: 'Plain Elaichi', message: 'Tell me about Plain Elaichi' },
  { label: 'Mirchi', message: 'Tell me about Mirchi ladoo' },
  { label: 'Masala', message: 'Tell me about Masala ladoo' },
  { label: 'Elaichi Ginger Saunf', message: 'Tell me about Elaichi Ginger Saunf' },
];

export const FALLBACK_MESSAGE = `I'm still learning about Anamritam 😊

I can currently help you with:
• Products
• Mahua Ladoos
• Protein Bars
• Nutri Bites
• Ordering
• Shipping
• Contact information

Try asking me one of these!`;
