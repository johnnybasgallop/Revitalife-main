"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
  isSubscription?: boolean;
  subscriptionInterval?: string;
  stripePriceId?: string;
}

interface BasketState {
  items: BasketItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

type BasketAction =
  | { type: "ADD_ITEM"; payload: BasketItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_BASKET" }
  | { type: "TOGGLE_BASKET" }
  | { type: "SET_BASKET_OPEN"; payload: boolean }
  | { type: "LOAD_FROM_STORAGE"; payload: BasketState };

const initialState: BasketState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );

        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const newItemCount = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        return {
          ...state,
          items: updatedItems,
          total: newTotal,
          itemCount: newItemCount,
        };
      } else {
        const newItems = [...state.items, action.payload];
        const newTotal = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const newItemCount = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        return {
          ...state,
          items: newItems,
          total: newTotal,
          itemCount: newItemCount,
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newItemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case "CLEAR_BASKET":
      return initialState;

    case "TOGGLE_BASKET":
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case "SET_BASKET_OPEN":
      return {
        ...state,
        isOpen: action.payload,
      };

    case "LOAD_FROM_STORAGE":
      return action.payload;

    default:
      return state;
  }
}

interface BasketContextType {
  state: BasketState;
  addItem: (item: BasketItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBasket: () => void;
  toggleBasket: () => void;
  setIsBasketOpen: (isOpen: boolean) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(basketReducer, initialState);

  // Load basket from localStorage on mount
  useEffect(() => {
    try {
      const savedBasket = localStorage.getItem("revitalife-basket");
      if (savedBasket) {
        const parsedBasket = JSON.parse(savedBasket);
        // Ensure we have all required fields
        const validBasket = {
          items: parsedBasket.items || [],
          total: parsedBasket.total || 0,
          itemCount: parsedBasket.itemCount || 0,
          isOpen: false, // Always start with basket closed on refresh
        };
        dispatch({ type: "LOAD_FROM_STORAGE", payload: validBasket });
      }
    } catch (error) {
      console.error("Error loading basket from localStorage:", error);
    }
  }, []);

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "revitalife-basket",
        JSON.stringify({
          items: state.items,
          total: state.total,
          itemCount: state.itemCount,
          // Don't save isOpen state to localStorage
        })
      );
    } catch (error) {
      console.error("Error saving basket to localStorage:", error);
    }
  }, [state.items, state.total, state.itemCount]);

  const addItem = (item: BasketItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  const clearBasket = () => {
    dispatch({ type: "CLEAR_BASKET" });
  };

  const toggleBasket = () => {
    dispatch({ type: "TOGGLE_BASKET" });
  };

  const setIsBasketOpen = (isOpen: boolean) => {
    dispatch({ type: "SET_BASKET_OPEN", payload: isOpen });
  };

  return (
    <BasketContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        toggleBasket,
        setIsBasketOpen,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
}
