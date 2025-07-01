import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lat: null,
  lng: null,
  city: "",  // Optional, can store user’s selected city
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
    },
    clearLocation: (state) => {
      state.lat = null;
      state.lng = null;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    clearCity: (state) => {
      state.city = "";
    },
  },
});

export const { setLocation, clearLocation, setCity, clearCity } = locationSlice.actions;

export default locationSlice.reducer;