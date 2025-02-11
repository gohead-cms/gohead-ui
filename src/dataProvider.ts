import { fetchUtils } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import config from './config';

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const token = localStorage.getItem('token');

    // Initialize headers if not present
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    } else if (!(options.headers instanceof Headers)) {
        options.headers = new Headers(options.headers);
    }

    // Set the Authorization header if the token exists
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    // Use fetchUtils.fetchJson to handle the response
    return fetchUtils.fetchJson(url, options);
};

// Update the dataProvider base URL to include the "/api" path segment.
// This makes the endpoint format: {config.apiUrl}/api/:collectionName
const dataProvider = simpleRestProvider(`${config.apiUrl}/api`, httpClient);

export default dataProvider;
