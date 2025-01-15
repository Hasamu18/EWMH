const USERS_API = 'https://ewmhuser.azurewebsites.net'
const SALES_API = 'https://ewmhsale.azurewebsites.net'
const REPAIR_REQUEST_API_PROD = 'https://ewmhrequest.azurewebsites.net'
const REPAIR_REQUEST_API_DEV = 'https://7e50-14-186-37-2.ngrok-free.app'

/* AUTH ENDPOINTS */
export const LOGIN_ENDPOINT = `${USERS_API}/api/account/1`   
export const PROFILE_ENDPOINT = `${USERS_API}/api/account/3`
export const UPDATE_PROFILE_ENDPOINT = `${USERS_API}/api/account/4`
export const UPDATE_AVATAR_ENDPOINT = `${USERS_API}/api/account/5`
export const LOGOUT_ENDPOINT = `${USERS_API}/api/account/12`   
export const SEND_RESET_PASSWORD_LINK_ENDPOINT = `${USERS_API}/api/account/8`   
export const RESET_PASSWORD_ENDPOINT = `${USERS_API}/api/account/9`   
export const RENEW_ACCESS_TOKEN_ENDPOINT = `${USERS_API}/api/account/11`

/* PRODUCT ENDPOINTS */
export const PRODUCT_BY_ID_ENDPOINT = `${SALES_API}/api/product/4`
export const PRODUCTS_ENDPOINT = `${SALES_API}/api/product/5`

/* REPAIR REQUEST ENDPOINTS */
export const GET_REPAIR_REQUESTS_ENDPOINT = `${REPAIR_REQUEST_API_PROD}/api/request/15`
export const GET_REPAIR_REQUEST_BY_ID_ENDPOINT = `${REPAIR_REQUEST_API_PROD}/api/request/16`
export const ADD_PRODUCT_TO_REPAIR_REQUEST = `${REPAIR_REQUEST_API_PROD}/api/request/6`
export const UPDATE_REPLACEMENT_PRODUCT_IN_REPAIR_REQUEST = `${REPAIR_REQUEST_API_PROD}/api/request/9`
export const DELETE_REPLACEMENT_PRODUCT_IN_REPAIR_REQUEST = `${REPAIR_REQUEST_API_PROD}/api/request/10`
export const CHECKOUT_REPAIR_REQUEST = `${REPAIR_REQUEST_API_PROD}/api/request/13`
export const COMPLETE_REPAIR_REQUEST = `${REPAIR_REQUEST_API_PROD}/api/request/14`
export const CANCEL_REQUEST = `${REPAIR_REQUEST_API_PROD}/api/request/4`
export const ADD_PRE_REPAIR_EVIDENCE = `${REPAIR_REQUEST_API_PROD}/api/request/30`
export const ADD_POST_REPAIR_EVIDENCE = `${REPAIR_REQUEST_API_PROD}/api/request/31`

/* WARRANTY REQUEST ENDPOINTS */
export const GET_WARRANTY_CARD_LIST_ENDPOINT = `${REPAIR_REQUEST_API_PROD}/api/request/21`
export const GET_WARRANTY_CARD_DETAILS_ENDPOINT = `${REPAIR_REQUEST_API_PROD}/api/request/22`
export const ADD_WARRANTY_CARD_TO_WARRANTY_REQUEST_ENDPOINT = `${REPAIR_REQUEST_API_PROD}/api/request/11`
export const REMOVE_WARRANTY_CARD_FROM_WARRANTY_REQUEST_ENDPOINT = `${REPAIR_REQUEST_API_PROD}/api/request/12`

/* SHIPPING ENDPOINTS */
export const GET_SHIPPING_ORDER = `${SALES_API}/api/shipping/3`
export const GET_SHIPPING_ORDERS = `${SALES_API}/api/shipping/4`
export const GET_SHIPPING_ORDER_DETAILS = `${SALES_API}/api/order/8`
export const SHIPPING_ASSIGNED_TO_DELIVERING_STATUS = `${SALES_API}/api/shipping/5`
export const SHIPPING_DELIVERING_TO_DELIVERED_STATUS = `${SALES_API}/api/shipping/6`
export const SHIPPING_DELIVERING_TO_DELAYED_STATUS = `${SALES_API}/api/shipping/7`