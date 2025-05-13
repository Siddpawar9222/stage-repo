import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        title: "",  
        isOpen: false,   
        bodyType: "",   
        size: "",      
        extraObject: {},
        pageTitle: '',
    },
    reducers: {

        openModal: (state, action) => {
            const { title, bodyType, extraObject, size } = action.payload
            state.isOpen = true
            state.bodyType = bodyType
            state.title = title
            state.size = size || 'md'
            state.extraObject = extraObject
        },

        closeModal: (state) => {
            state.isOpen = false
            state.bodyType = ""
            state.title = ""
            state.extraObject = {}
        },
        setPageTitle: (state, action) => { // Added setPageTitle reducer
            state.pageTitle = action.payload;
        },

    }
})

export const { openModal, closeModal, setPageTitle  } = modalSlice.actions

export default modalSlice.reducer



/*
title:          current  title of modal
isOpen :        boolean indicates whether modal is open or not
bodyType :      which type of modal e.g. confirmation, error, session expired etc.
size : "",      modal size
extraObject:    To pass data from current component to modal
pageTitle : To store the title of the current page/navigation
*/