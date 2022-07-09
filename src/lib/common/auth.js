import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

import { envars } from '$lib/envars';

export async function fetchTokens() {
  let url = `${envars.apiUrl}/Auth`;
  let query = `
  query {
    login(username: "${envars.apiUser}", password: "${envars.apiPassword}") {
      jwt,
      refresh,
      user {
        id,
        fname,
        lname,
        email
      }
    }
  }
  `;

  let response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ query: query })
  });
  if (response.ok) {
    let json = await response.json();
    saveTokens(json.data.login);
  } else {
    throw new Error('Could not fetch tokens.');
  }
}

async function refreshJwt(refreshToken) {
  let authUrl = `${envars.apiUrl}/Auth`;
  let query = `
    {
      refresh(token: "${refreshToken}") {
        jwt
      }
    }
  `;

  let response = await fetch(authUrl, {
    method: 'POST',
    body: JSON.stringify({ query: query })
  });

  if (response.ok) {
    let json = await response.json();
    saveTokens(json.data.refresh, false);
  } else {
    throw new Error('Could not refresh tokens.');
  }
}

function saveTokens(loginData, includeRefresh = true) {
  let jwt = loginData.jwt;
  let jwtData = decodeToken(jwt);
  if (jwtData.iss !== envars.jwtDomain || jwtData.aud !== envars.jwtDomain) {
    throw new Error(`Invalid JWT: ${jwtData.iss} ${jwtData.aud}`);
  }

  localStorage.setItem('caJwtToken', jwt);
  localStorage.setItem('caJwtExpiresAt', jwtData.exp);

  if (includeRefresh) {
    let refresh = loginData.refresh;
    let refreshData = decodeToken(refresh);
    if (refreshData.iss !== envars.jwtDomain || refreshData.aud !== envars.jwtDomain) {
      throw new Error(`Invalid Refresh token: ${refreshData.iss} ${refreshData.aud}`);
    }

    localStorage.setItem('caRefreshToken', refresh);
    localStorage.setItem('caRefreshExpiresAt', refreshData.exp);
  }
}

function decodeToken(token) {
  let parts = token.split('.');
  var parsed = Base64.parse(parts[1]);
  return JSON.parse(Utf8.stringify(parsed));
}

export async function autoRefreshTokens() {
  let now = Date.now() / 1000;
  let jwtExpiresAt = localStorage.getItem('caJwtExpiresAt');
  let refreshExpiresAt = localStorage.getItem('caRefreshExpiresAt');
  let refreshToken = localStorage.getItem('caRefreshToken');

  if (jwtExpiresAt && refreshExpiresAt) {
    // jwt is expired
    if (jwtExpiresAt < now) {
      // refresh is expired
      if (refreshExpiresAt < now) {
        await fetchTokens();
        // refresh not expired
      } else {
        refreshJwt(refreshToken);
      }
    }
  } else {
    await fetchTokens();
  }
}
