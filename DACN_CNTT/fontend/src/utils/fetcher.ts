import { sendRequest } from "./api"

export const Fetcher = (url: string) => {
    sendRequest<IBackendRes<any>>({ url, method: "GET" }).then((res) => res.data)
}