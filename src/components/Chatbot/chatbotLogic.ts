import { CONTACT_DETAILS } from '@/config';
import {
  FALLBACK_MESSAGE,
  LADOO_QUICK_ACTIONS,
  MAIN_QUICK_ACTIONS,
  type ChatQuickAction,
} from './chatbotData';

export type ChatProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string;
};

export type ChatbotReply = {
  text: string;
  quickActions?: ChatQuickAction[];
  productId?: string;
  category?: 'All' | 'Ladoos' | 'Protein Bars';
  showCart?: boolean;
  showContact?: boolean;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const includesAny = (value: string, terms: string[]) => terms.some(term => value.includes(term));

function productReply(product: ChatProduct): ChatbotReply {
  const ingredients = product.id === 'nutri-bites' ? ` It contains ${product.ingredients.toLowerCase()}.` : '';
  return {
    text: `${product.name}: ${product.description}${ingredients}`,
    productId: product.id,
  };
}

export function getChatbotReply(message: string, products: ChatProduct[]): ChatbotReply {
  const query = normalize(message);
  const find = (id: string) => products.find(product => product.id === id);

  const namedProducts: Array<[string[], string]> = [
    [['elaichi ginger saunf', 'ginger saunf'], 'elaichi-ginger-saunf'],
    [['plain elaichi'], 'plain-elaichi'],
    [['mirchi'], 'mirchi'],
    [['masala'], 'masala'],
    [['protein bar 1', 'proteinbar 1', 'first protein bar'], 'protein-bar-1'],
    [['protein bar 2', 'proteinbar 2', 'second protein bar'], 'protein-bar-2'],
  ];

  for (const [terms, id] of namedProducts) {
    if (includesAny(query, terms)) {
      const product = find(id);
      if (product) return productReply(product);
    }
  }

  if (includesAny(query, ['nutri bites', 'nutribites', 'kids range', 'kid range'])) {
    const product = find('nutri-bites');
    if (!product) return { text: FALLBACK_MESSAGE, quickActions: MAIN_QUICK_ACTIONS };
    if (includesAny(query, ['what age', 'which age', 'age for', 'for kids', 'for children'])) {
      return { text: 'Nutri Bites is designed as a tasty, kids-friendly option for children age 3+.', productId: product.id };
    }
    if (includesAny(query, ['contain', 'ingredient', 'made of', 'made with'])) {
      return { text: `Nutri Bites contains ${product.ingredients.toLowerCase()}. Please check the product pack for complete details.`, productId: product.id };
    }
    return {
      text: `Nutri Bites is our kids' range for children age 3+. ${product.description} It is made with ${product.ingredients.toLowerCase()}.`,
      productId: product.id,
    };
  }

  if (includesAny(query, ['shipping', 'delivery free', 'free delivery'])) {
    return { text: 'Shipping is free on orders above ₹999. For other orders, shipping is calculated at checkout.' };
  }

  if (includesAny(query, ['how do i order', 'how can i order', 'how can i buy', 'place an order', 'checkout work'])) {
    return {
      text: 'Choose a product, add it to your cart, then open the cart and select Checkout. Enter your delivery details, review your order, and continue to the final order form.',
      category: 'All',
      showCart: true,
    };
  }

  if (includesAny(query, ['where is the cart', 'open cart', 'show cart', 'my cart'])) {
    return { text: 'Your cart is available from the shopping-bag button in the navigation. You can also open it here.', showCart: true };
  }

  if (includesAny(query, ['contact', 'phone', 'email', 'located', 'location', 'address', 'where are you'])) {
    return {
      text: `You can reach Anamritam at ${CONTACT_DETAILS.email} or ${CONTACT_DETAILS.phone}. We are located at ${CONTACT_DETAILS.address}.`,
      showContact: true,
    };
  }

  if (includesAny(query, ['which ladoo', 'recommend ladoo', 'choose ladoo'])) {
    return {
      text: 'For a classic flavour, try Plain Elaichi. Mirchi adds a gentle chilli note, Masala brings warming spices, and Elaichi Ginger Saunf is fragrant and layered. Which sounds most like you?',
      quickActions: LADOO_QUICK_ACTIONS,
    };
  }

  if (includesAny(query, ['ladoo', 'ladoos', 'flavour', 'flavor'])) {
    const names = products.filter(product => product.category === 'Ladoos').map(product => `• ${product.name}`).join('\n');
    return {
      text: `We currently have four Mahua ladoo flavours:\n${names}\n\nWould you like to know more about any of them?`,
      quickActions: LADOO_QUICK_ACTIONS,
      category: 'Ladoos',
    };
  }

  if (includesAny(query, ['protein bar', 'protein bars'])) {
    const bars = products.filter(product => product.category === 'Protein Bars' && product.id !== 'nutri-bites');
    return {
      text: `We have ${bars.map(product => product.name).join(' and ')}. ${bars.map(product => `${product.name} is ${product.description.charAt(0).toLowerCase()}${product.description.slice(1)}`).join(' ')}`,
      quickActions: bars.map(product => ({ label: product.name, message: `Tell me about ${product.name}` })),
      category: 'Protein Bars',
    };
  }

  if (includesAny(query, ['what is anamritam', 'about anamritam', 'tell me about anamritam'])) {
    return { text: 'Anamritam brings together traditional Indian ingredients and modern nutrition: honest food, thoughtfully made for everyday nourishment. Pure • Fresh • Wholesome.' };
  }

  if (includesAny(query, ['different', 'why anamritam', 'why choose'])) {
    return { text: 'Anamritam focuses on thoughtfully sourced, wholesome ingredients, small-batch care, Indian food traditions, and nourishment that fits modern everyday life.' };
  }

  if (includesAny(query, ['what do you sell', 'what products', 'show products', 'explore products', 'your products', 'products do you have'])) {
    return {
      text: 'We make Mahua ladoos, two protein bar variants, and Nutri Bites for kids. You can explore the full range here.',
      quickActions: MAIN_QUICK_ACTIONS.slice(1, 4),
      category: 'All',
    };
  }

  return { text: FALLBACK_MESSAGE, quickActions: MAIN_QUICK_ACTIONS };
}
