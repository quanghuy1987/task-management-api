import axios from 'axios'
let token = document.head.querySelector('meta[name="csrf-token"]')

const http = axios.create()
http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
http.defaults.withCredentials = true
if (token) {
    http.defaults.headers.common['X-CSRF-TOKEN'] = token.content
}
http.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if ([401].includes(error.response?.status) && error.response?.data?.message === 'refresh_token_expired') {
            http.post('/logout')
                .then((res) => {
                    window.location.reload();
                })
        }
    }
);
const openLink = (to, newTab) => {
    let target = ''
    if (newTab) {
        target = '_BLANK'
    }
    window.open(to, target)
}
const getQueryParams = (name) => {
    const urlObject = new URL(window.location.href)

    const params = urlObject.searchParams

    return name ? params.get(name) : params
}

export { http, openLink, getQueryParams }
