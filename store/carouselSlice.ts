// store/carouselSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CarouselState {
  currentIndex: number;
  totalSlides: number;
  isPaused: boolean;
}

const initialState: CarouselState = {
  currentIndex: 0,
  totalSlides: 0,
  isPaused: false,
};

const carouselSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
    nextSlide: (state) => {
      if (state.totalSlides > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.totalSlides;
      }
    },
    prevSlide: (state) => {
      if (state.totalSlides > 0) {
        state.currentIndex = (state.currentIndex - 1 + state.totalSlides) % state.totalSlides;
      }
    },
    setTotalSlides: (state, action: PayloadAction<number>) => {
      state.totalSlides = action.payload;
    },
    togglePause: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
  },
});

// ✅ Named exports for actions
export const { nextSlide, prevSlide, setTotalSlides, togglePause } = carouselSlice.actions;

// ✅ Default export for reducer
export default carouselSlice.reducer;