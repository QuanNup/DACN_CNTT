import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendRequest } from "./utils/api";
import { InactiveAccountError, InvalidEmailError, InvalidPasswordError } from "./utils/errors";
import { IUser } from "./types/next-auth";
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "OAuthCallback",
            id: 'OAuthCallback',
            credentials: {
                id: { label: "ID", type: "text" },
                name: { label: "Name", type: "text" },
                email: { label: "Email", type: "text" },
                image: { label: "Image", type: "text" },
                role: { label: "Role", type: "text" },
                access_token: { label: "Access Token", type: "text" },
                refresh_token: { label: "Refresh Token", type: "text" },
            },
            async authorize(credentials) {
                if (credentials) {
                    const { id, name, email, image, role, access_token, refresh_token } = credentials as Record<string, string>;
                    return {
                        id,
                        name,
                        email,
                        image,
                        role: role.split(','),
                        access_token,
                        refresh_token,
                    };
                }
                return null;
            },
        }),
        CredentialsProvider({
            name: "EmailPassword",
            id: 'EmailPassword',
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await sendRequest<IBackendRes<ILogin>>({
                    method: "POST",
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
                    body: {
                        email: credentials.email,
                        password: credentials.password
                    },
                    useCredentials: true
                    // headers: {
                    //     'Content-Type': 'application/json',
                    // },
                })
                if (res.statusCode === 201) {
                    return {
                        name: res.data?.user?.name,
                        email: res.data?.user?.email,
                        image: res.data?.user?.image,
                        phone: res.data?.user?.phone,
                        address: res.data?.user?.address,
                        role: res.data?.user?.role,
                        access_token: res.data?.access_token,
                        refresh_token: res.data?.refresh_token
                    };
                } else if (+res.statusCode === 404) {
                    throw new InvalidEmailError()
                } else if (+res.statusCode === 401) {
                    throw new InvalidPasswordError()
                } else if (+res.statusCode === 400) {
                    throw new InactiveAccountError()
                } else {
                    throw new Error("Internal server error")
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        //signOut: "auth/signout"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = (user as IUser);
            }
            if (token.user?.id) {
                try {
                    const updatedUser = await sendRequest<IBackendRes<any>>({
                        method: "GET",
                        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/get-user`,
                        useCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token.user.access_token}`,
                        },
                    });

                    if (updatedUser?.statusCode === 200) {
                        token.user.image = updatedUser.data.image;
                        token.user.name = updatedUser.data.name;
                        token.user.phone = updatedUser.data.phone;
                        token.user.address = updatedUser.data.address;
                    }
                } catch (error) {
                    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            (session.user as IUser) = token.user
            return session
        },
        authorized: ({ auth }) => {
            return !!auth
        },
    },
})