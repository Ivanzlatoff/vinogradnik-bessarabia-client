import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


let TOKEN
if (!localStorage?.getItem("persist:root")) {
    TOKEN = {}
} else {
    TOKEN = JSON.parse(JSON.parse(localStorage?.getItem("persist:root"))?.user)?.currentUser?.accessToken;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api/',
        prepareHeaders: (headers) => {
            if (TOKEN) {
                headers.set('token', `Bearer ${TOKEN}`)
            };
            return headers
        },
    }),
    endpoints: builder => ({
        getCart: builder.query({
            query: (userId) => `carts/find/${userId}`
        }),
        createCart: builder.mutation({
            query: (newCart) => ({
                url: 'carts',
                method: 'POST',
                body: newCart               
            })
        }),
        updateCart: builder.mutation({
            query: (updatedCart) => ({
                url: `carts/${updatedCart.id}`,
                method: 'PUT',
                body: updatedCart
            })
        })
    })
});

export const { 
    useGetCartQuery,
    useCreateCartMutation,
    useUpdateCartMutation
} = apiSlice;