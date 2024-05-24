import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    isAuthenticated: localStorage.getItem('tokenLogin') ? true : false,
    isGoogleAuthenticated: false, // Remettre à false lors de la déconnexion
    userEmail: ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.userEmail = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userEmail = '';
            state.isGoogleAuthenticated = false;
            localStorage.removeItem('tokenLogin');
        },
        googleLogin(state) {
            state.isAuthenticated = true;
            state.isGoogleAuthenticated = true;
        },
        // Ajout de la fonction loginGoogle
        loginGoogle(state) {
            state.isGoogleAuthenticated = true;
        }
    }
});

export const authActions = authSlice.actions;
export default authSlice;
