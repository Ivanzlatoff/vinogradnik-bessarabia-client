import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userRequest } from "../requestMethods";


export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (userId) => {
    const res = await userRequest.get(`wishlists/find/${userId}`, {
        withCredentials: true
    });
    return res.data;
});

export const saveNewWishlist = createAsyncThunk('wishlist/saveNewWishlist', async wishlist => {
    const newWishlist = { wishlist }
    try {
        const res = await userRequest.put(`/${wishlist.id}`, { 
            wishlist: newWishlist,
            withCredentials: true
        })
        return res.data;
    } catch(err) {
        console.log(err)
    }
})

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        products: [],
        quantity: 0,
        status: 'idle',
        error: null  
    },
    reducers: {
        addProduct: (state, action) => {
            if (state.products?.length > 0) {
                for (let i = 0; i < state.products.length; i++) {
                    if (state.products[i]['_id'] === action.payload._id) {
                        state.products[i].quantity += action.payload.quantity;
                        return
                    } 
                }
                state.quantity += 1;
                state.products.push(action.payload);              
            } else {
                state.quantity += 1;
                state.products.push(action.payload);
            }
        },
        deleteProduct: (state, action) => {
            if (state.products.length > 0) {
                for (let i = 0; i < state.products.length; i++) {
                    if (state.products[i]['_id'] === action.payload._id) {
                        state.products.splice(i, 1);
                        state.quantity -= 1;    
                        return
                    } 
                }        
            }
        },
        clearWishlist: (state) => {
            state.products = [];
            state.quantity = 0;
            state.totalPrice = 0;
            state.status = 'cleared';
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeded';
                state.id = action.payload?._id || null;
                state.createdAt = action.payload?.createdAt || null;
                state.updatedAt = action.payload?.updatedAt || null;
                state.products = action.payload?.products || [];
                state.quantity = state.products?.length || 0;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(saveNewWishlist.fulfilled, (state, action) => {
                state.status = 'succeded';
                state.id = action.payload?._id || null;
                state.createdAt = action.payload?.createdAt || null;
                state.updatedAt = action.payload?.updatedAt || null;
                state.products = action.payload?.products || [];
                state.quantity = state.products?.length || 0;
            })
    },
});

export const { addProduct, deleteProduct, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;