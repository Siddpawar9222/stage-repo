import { createSlice } from '@reduxjs/toolkit'

export const headerSlice = createSlice({
    name: 'header',
    initialState: {
        pageTitle: "Home",         // current page title 
        //noOfNotifications : 15,  // no of unread notifications(not need right now) 
        newNotificationMessage: "",  // message of notification to be shown
        newNotificationStatus: null,   // to check the notification type -  success/ error/ info
        //showLeftDrawer : true    // to show/hide left sidebar
    },
    reducers: {

        setPageTitle: (state, action) => {
            state.pageTitle = action.payload.title
        },

        removeNotificationMessage: (state, action) => {
            state.newNotificationMessage = ""
            state.newNotificationStatus = null
        },

        showNotification: (state, action) => {
            state.newNotificationMessage = action.payload.message
            state.newNotificationStatus = action.payload.status
        },
    }
})

export const { setPageTitle, removeNotificationMessage, showNotification } = headerSlice.actions

export default headerSlice.reducer

/*
Notification message status :
0-error
1-success
2-info
3-warning
*/