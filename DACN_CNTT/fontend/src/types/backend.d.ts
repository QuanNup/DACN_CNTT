export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
        onUploadProgress?: (progressEvent: ProgressEvent) => void
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        hasMore?: boolean;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            phone: string;
            address: string;
            role: string[];
        }
        access_token: string;
        refresh_token: string;
    }

}
