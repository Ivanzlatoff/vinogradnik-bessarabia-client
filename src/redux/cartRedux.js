import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userRequest } from "../requestMethods";


export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId) => {
    try {
        const res = await userRequest.get(`carts/find/${userId}`, {
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.log(err)
    }
});

export const saveNewCart = createAsyncThunk('cart/saveNewCart', async cart => {
    const newCart = { cart }
    try {
        const res = await userRequest.put(`/${cart.id}`, { 
            cart: newCart,
            withCredentials: true
        });
        return res.data
    } catch(err) {
        console.log(err)
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products: [],
        quantity: 0,
        totalPrice: 0,
        status: 'idle',
        error: null     
    },
    reducers: {
        addProduct: (state, action) => {
            if (state.products?.length > 0) {
                for (let i = 0; i < state.products.length; i++) {
                    if (state.products[i]['_id'] === action.payload._id && state.products[i]['color'] === action.payload.color) {
                        state.products[i].quantity += action.payload.quantity;
                        state.totalPrice += action.payload.price * action.payload.quantity;
                        return
                    } 
                }
                state.quantity += 1;
                state.products.push(action.payload);
                state.totalPrice += action.payload.price * action.payload.quantity;               
            } else {
                state.quantity += 1;
                state.products.push(action.payload);
                state.totalPrice += action.payload.price * action.payload.quantity;
            }
        },
        increaseProduct: (state, action) => {
            if (state.products.length > 0) {
                for (let i = 0; i < state.products.length; i++) {
                    if (state.products[i]['_id'] === action.payload._id && state.products[i]['color'] === action.payload.color) {
                        if (state.products[i].quantity < 10000) {
                            state.products[i].quantity += 100;
                            state.totalPrice += action.payload.price * 100;
                        }
                        return                        
                    }
                }
            }
        },
        decreaseProduct: (state, action) => {
            if (state.products.length > 0) {
                for (let i = 0; i < state.products.length; i++) {
                    if (state.products[i]['_id'] === action.payload._id && state.products[i]['color'] === action.payload.color) {
                        if (state.products[i].quantity > 100) {
                            state.products[i].quantity -= 100;
                            state.totalPrice -= action.payload.price * 100;
                        }
                        return                        
                    }
                }
            }
        },
        deleteProduct: (state, action) => {
            if (state.products.length > 0) {
                for (let i = 0; i < state.products.length; i++) {
                    if (state.products[i]['_id'] === action.payload._id && state.products[i]['color'] === action.payload.color) {
                        state.totalPrice -= state.products[i].price*state.products[i].quantity;
                        state.products.splice(i, 1);
                        state.quantity -= 1;    
                        return
                    } 
                }        
            }
        },
        clearCart: (state) => {
            state.products = [];
            state.quantity = 0;
            state.totalPrice = 0;
            state.status = 'cleared';

        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeded';
                state.id = action.payload?._id || null;
                state.createdAt = action.payload?.createdAt || null;
                state.updatedAt = action.payload?.updatedAt || null;
                state.products = action.payload?.products || [];
                state.quantity = state.products?.length || 0;
                state.totalPrice = state.products?.reduce((next, product) => next + product['price']*product['quantity'], 0) || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(saveNewCart.fulfilled, (state, action) => {
                state.status = 'succeded';
                state.id = action.payload?._id || null;
                state.createdAt = action.payload?.createdAt || null;
                state.updatedAt = action.payload?.updatedAt || null;
                state.products = action.payload?.products || [];
                state.quantity = state.products?.length || 0;
                state.totalPrice = state.products?.reduce((next, product) => next + product['price']*product['quantity'], 0) || 0;
            })
    },
});

export const { addProduct, increaseProduct, decreaseProduct, deleteProduct, clearCart } = cartSlice.actions;
export default cartSlice.reducer;