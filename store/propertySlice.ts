import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PropertyState {
  selectedPropertyType: string | null;
  selectedCity: string | null;
  hoveredPropertyType: string | null;
  hoveredCity: string | null;
}

const initialState: PropertyState = {
  selectedPropertyType: null,
  selectedCity: null,
  hoveredPropertyType: null,
  hoveredCity: null,
};

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedPropertyType: (state, action: PayloadAction<string | null>) => {
      state.selectedPropertyType = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<string | null>) => {
      state.selectedCity = action.payload;
    },
    setHoveredPropertyType: (state, action: PayloadAction<string | null>) => {
      state.hoveredPropertyType = action.payload;
    },
    setHoveredCity: (state, action: PayloadAction<string | null>) => {
      state.hoveredCity = action.payload;
    },
    resetSelections: (state) => {
      state.selectedPropertyType = null;
      state.selectedCity = null;
    }
  }
});

export const { 
  setSelectedPropertyType, 
  setSelectedCity, 
  setHoveredPropertyType, 
  setHoveredCity,
  resetSelections 
} = propertySlice.actions;

export default propertySlice.reducer;