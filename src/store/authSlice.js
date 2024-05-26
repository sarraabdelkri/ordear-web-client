import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';


const initialState = {
    isAuthenticated: localStorage.getItem('tokenLogin') ? true : false,
    isGoogleAuthenticated: false,
    userEmail: '',
    userId: localStorage.getItem('tokenLogin') ? jwtDecode(localStorage.getItem('tokenLogin')).id : null // Assurez-vous que 'id' est le bon nom de la clé dans votre JWT
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.userEmail = action.payload.email;
            state.userId = action.payload.id;
            localStorage.setItem('tokenLogin', action.payload.token);
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userEmail = '';
            state.isGoogleAuthenticated = false;
            state.userId = null;
            localStorage.removeItem('tokenLogin');
        },
        googleLogin(state) {
            state.isAuthenticated = true;
            state.isGoogleAuthenticated = true;
        },
        loginGoogle(state) {
            state.isGoogleAuthenticated = true;
        }
    }
});

export const authActions = authSlice.actions;
export default authSlice;
