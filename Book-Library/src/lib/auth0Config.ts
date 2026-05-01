

export const auth0Config = {
 clientId: 'Iw3lRLeJLaulMVcfvHW5ePkUEnKqd3kS',
 issuer: "dev-6qtr30vk60x15j0l.us.auth0.com",
 audience: "http://localhost:8080",
 redirectUri: window.location.origin+"/login/callback",
 scope: 'openid profile email'
}