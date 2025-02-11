// File: src/customDataProvider.ts
import {
    DataProvider,
    fetchUtils,
    RaRecord,
    Identifier,
    CreateParams,
    CreateResult,
} from "react-admin";
import config from "./config";

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
    const token = localStorage.getItem("token");

    if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
    } else if (!(options.headers instanceof Headers)) {
        options.headers = new Headers(options.headers);
    }

    if (token) {
        options.headers.set("Authorization", `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

// Resources that use the admin management endpoints
const adminResources = ["collections", "single-types", "components"];

// Choose the correct base URL based on the resource name.
const getBaseUrl = (resource: string) =>
    adminResources.includes(resource)
        ? `${config.apiUrl}/admin`
        : `${config.apiUrl}/api`;

const customDataProvider: DataProvider = {
    getList: (resource, params) => {
        const url = `${getBaseUrl(resource)}/${resource}`;
        return httpClient(url).then(({ json }) => {
            let data: any[] = [];
            // If the response is directly an array, use it.
            if (Array.isArray(json)) {
                data = json;
            }
            // If the response has a 'data' property that is an array, use that.
            else if (json && Array.isArray(json.data)) {
                data = json.data;
            }
            // Otherwise, fallback to an empty array.
            return {
                data,
                total: data.length,
            };
        });
    },

    getOne: (resource, params) => {
        const url = `${getBaseUrl(resource)}/${resource}/${params.id}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getMany: (resource, params) => {
        const requests = params.ids.map((id) =>
            httpClient(`${getBaseUrl(resource)}/${resource}/${id}`).then(
                ({ json }) => json
            )
        );
        return Promise.all(requests).then((data) => ({ data }));
    },

    getManyReference: (resource, params) => {
        const url = `${getBaseUrl(resource)}/${resource}`;
        return httpClient(url).then(({ json }) => ({
            data: json,
            total: Array.isArray(json) ? json.length : 0,
        }));
    },

    update: (resource, params) => {
        const url = `${getBaseUrl(resource)}/${resource}/${params.id}`;
        return httpClient(url, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    updateMany: (resource, params) =>
        Promise.resolve({ data: [] }),

    // Corrected create method:
    create: <RecordType extends Omit<RaRecord, "id"> = any,
             ResultRecordType extends RaRecord = RecordType & { id: Identifier }>(
        resource: string,
        params: CreateParams<RecordType>
    ): Promise<CreateResult<ResultRecordType>> => {
        const url = `${getBaseUrl(resource)}/${resource}`;
        return httpClient(url, {
            method: "POST",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            // Force the conversion through 'unknown' first to satisfy TypeScript
            data: ({ ...params.data, id: json.id } as unknown) as ResultRecordType,
        }));
    },

    delete: (resource, params) => {
        const url = `${getBaseUrl(resource)}/${resource}/${params.id}`;
        return httpClient(url, { method: "DELETE" }).then(({ json }) => ({
            data: json,
        }));
    },

    deleteMany: (resource, params) =>
        Promise.resolve({ data: [] }),
};

export default customDataProvider;
