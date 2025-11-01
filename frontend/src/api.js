// frontend/src/api.js
const API = 'http://localhost:4000/api';

export async function apiPost(path, body, token){
    const res = await fetch(API + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        },
        body: JSON.stringify(body)
    });
    return res;
}
export async function apiGet(path, token){
    const res = await fetch(API + path, {
        headers: {
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        }
    });
    return res;
}
export async function apiPut(path, body, token){
    const res = await fetch(API + path, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        },
        body: JSON.stringify(body)
    });
    return res;
}
export default API;
