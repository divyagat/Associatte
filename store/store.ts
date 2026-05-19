// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import carouselReducer from './carouselSlice';
import propertyReducer from './propertySlice'; // ✅ Add this import

export const store = configureStore({
  reducer: {
    carousel: carouselReducer,
    property: propertyReducer, // ✅ Add this line
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;