import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  items: WishListItem[];
};

type WishListItem = {
  id: string | number;
  slug: string;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  currency?: string;
  status?: string;
  externalUrl?: string | null;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

const initialState: InitialState = {
  items: [],
};

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const { id, slug, title, price, quantity, imgs, discountedPrice, status, currency, externalUrl } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          slug,
          title,
          price,
          quantity,
          imgs,
          discountedPrice,
          status,
          currency,
          externalUrl,
        });
      }
    },
    removeItemFromWishlist: (state, action: PayloadAction<string | number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },

    removeAllItemsFromWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
} = wishlist.actions;
export default wishlist.reducer;
