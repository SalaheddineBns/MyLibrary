import { profile } from "console"
import { Redirect } from "react-router-dom"

export const oktaConfig = {
    clientId: '0oa8pain8en7qSXnX5d7',
    issuer: 'https://dev-12367658.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid','profile','email'],
    pkce:true,
    disableHttpsChecks:true,
}