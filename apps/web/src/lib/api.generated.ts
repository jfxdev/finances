export interface paths {
    "/api/v1/auth/setup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: email */
                        email: string;
                        name: string;
                        password: string;
                        setupToken?: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            user: {
                                /** Format: uuid */
                                id: string;
                                /** Format: email */
                                email: string;
                                name: string;
                                admin: boolean;
                            };
                            csrf: string;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: email */
                        email: string;
                        password: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            user: {
                                /** Format: uuid */
                                id: string;
                                /** Format: email */
                                email: string;
                                name: string;
                                admin: boolean;
                            };
                            csrf: string;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            user: {
                                /** Format: uuid */
                                id: string;
                                /** Format: email */
                                email: string;
                                name: string;
                                admin: boolean;
                            };
                            csrf: string;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        token: string;
                        password: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        currentPassword: string;
                        password: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            name: string;
                            /** @default BRL */
                            currency: string;
                            /** @default America/Sao_Paulo */
                            timezone: string;
                            /** Format: uuid */
                            id: string;
                            personal: boolean;
                            /** @enum {string} */
                            role: "owner" | "editor" | "reader";
                            version: number;
                        }[];
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        /** @default BRL */
                        currency?: string;
                        /** @default America/Sao_Paulo */
                        timezone?: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        /** @default BRL */
                        currency?: string;
                        /** @default America/Sao_Paulo */
                        timezone?: string;
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/members/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    userId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    userId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        role: "owner" | "editor" | "reader";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/invites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        role: "editor" | "reader";
                        /** @default false */
                        sharePersonal?: boolean;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/invites/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        token: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        /**
                         * Format: date-time
                         * @default null
                         */
                        expiresAt?: string | null;
                        grants: {
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            operations: ("read" | "create" | "update" | "delete")[];
                        }[];
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/keys/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            items: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                            total: number;
                            page: number;
                            limit: number;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "idempotency-key"?: string;
                };
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        /** @default #16a34a */
                        color?: string;
                        /**
                         * @default ellipsis
                         * @enum {string}
                         */
                        icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                        /** @default false */
                        archived?: boolean;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                        data: {
                            name: string;
                            /** @default #16a34a */
                            color?: string;
                            /**
                             * @default ellipsis
                             * @enum {string}
                             */
                            icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            /** @default false */
                            archived?: boolean;
                        };
                        effectiveFrom?: unknown;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/expenses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            items: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                            total: number;
                            page: number;
                            limit: number;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "idempotency-key"?: string;
                };
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        description: string;
                        amount: string;
                        /** Format: uuid */
                        categoryId: string;
                        dueDate: string;
                        /**
                         * @default pending
                         * @enum {string}
                         */
                        status?: "pending" | "confirmed" | "cancelled";
                        /** @default null */
                        effectiveDate?: string | null;
                        /** @default  */
                        notes?: string;
                        /** @enum {string} */
                        icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/expenses/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                        data: {
                            description: string;
                            amount: string;
                            /** Format: uuid */
                            categoryId: string;
                            dueDate: string;
                            /**
                             * @default pending
                             * @enum {string}
                             */
                            status?: "pending" | "confirmed" | "cancelled";
                            /** @default null */
                            effectiveDate?: string | null;
                            /** @default  */
                            notes?: string;
                            /** @enum {string} */
                            icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                        };
                        effectiveFrom?: unknown;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/incomes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            items: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                            total: number;
                            page: number;
                            limit: number;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "idempotency-key"?: string;
                };
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        description: string;
                        amount: string;
                        /** Format: uuid */
                        categoryId: string;
                        dueDate: string;
                        /**
                         * @default pending
                         * @enum {string}
                         */
                        status?: "pending" | "confirmed" | "cancelled";
                        /** @default null */
                        effectiveDate?: string | null;
                        /** @default  */
                        notes?: string;
                        /** @enum {string} */
                        icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/incomes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                        data: {
                            description: string;
                            amount: string;
                            /** Format: uuid */
                            categoryId: string;
                            dueDate: string;
                            /**
                             * @default pending
                             * @enum {string}
                             */
                            status?: "pending" | "confirmed" | "cancelled";
                            /** @default null */
                            effectiveDate?: string | null;
                            /** @default  */
                            notes?: string;
                            /** @enum {string} */
                            icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                        };
                        effectiveFrom?: unknown;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/recurrences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            items: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                            total: number;
                            page: number;
                            limit: number;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "idempotency-key"?: string;
                };
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        description: string;
                        amount: string;
                        /** Format: uuid */
                        categoryId: string;
                        /** @enum {string} */
                        type: "expense" | "income";
                        /** @enum {string} */
                        frequency: "daily" | "weekly" | "monthly" | "yearly";
                        /** @default 1 */
                        interval?: number;
                        startDate: string;
                        /** @default null */
                        endDate?: string | null;
                        /** @default false */
                        paused?: boolean;
                        /** @default  */
                        notes?: string;
                        /** @enum {string} */
                        icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/recurrences/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                        data: {
                            description: string;
                            amount: string;
                            /** Format: uuid */
                            categoryId: string;
                            /** @enum {string} */
                            type: "expense" | "income";
                            /** @enum {string} */
                            frequency: "daily" | "weekly" | "monthly" | "yearly";
                            /** @default 1 */
                            interval?: number;
                            startDate: string;
                            /** @default null */
                            endDate?: string | null;
                            /** @default false */
                            paused?: boolean;
                            /** @default  */
                            notes?: string;
                            /** @enum {string} */
                            icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                        };
                        effectiveFrom?: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/investments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            items: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                            total: number;
                            page: number;
                            limit: number;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "idempotency-key"?: string;
                };
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        /** @enum {string} */
                        type: "investment" | "savings";
                        /** @default  */
                        institution?: string;
                        /** @default 0 */
                        initialBalance?: string;
                        startDate: string;
                        /** @default null */
                        goal?: string | null;
                        /** @default null */
                        goalDate?: string | null;
                        /**
                         * @default other
                         * @enum {string}
                         */
                        product?: "cdb" | "lci" | "lca" | "other";
                        /** @default false */
                        taxable?: boolean;
                        /** @default 0 */
                        taxRate?: number;
                        /** @default null */
                        expectedAnnualReturn?: number | null;
                        /** @default null */
                        maturityDate?: string | null;
                        /** @default  */
                        notes?: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/investments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                        data: {
                            name: string;
                            /** @enum {string} */
                            type: "investment" | "savings";
                            /** @default  */
                            institution?: string;
                            /** @default 0 */
                            initialBalance?: string;
                            startDate: string;
                            /** @default null */
                            goal?: string | null;
                            /** @default null */
                            goalDate?: string | null;
                            /**
                             * @default other
                             * @enum {string}
                             */
                            product?: "cdb" | "lci" | "lca" | "other";
                            /** @default false */
                            taxable?: boolean;
                            /** @default 0 */
                            taxRate?: number;
                            /** @default null */
                            expectedAnnualReturn?: number | null;
                            /** @default null */
                            maturityDate?: string | null;
                            /** @default  */
                            notes?: string;
                        };
                        effectiveFrom?: unknown;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/movements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            items: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                            total: number;
                            page: number;
                            limit: number;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "idempotency-key"?: string;
                };
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: uuid */
                        investmentId: string;
                        /** @enum {string} */
                        type: "deposit" | "withdrawal";
                        amount: string;
                        date: string;
                        /** @default  */
                        notes?: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/movements/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                        data: {
                            /** Format: uuid */
                            investmentId: string;
                            /** @enum {string} */
                            type: "deposit" | "withdrawal";
                            amount: string;
                            date: string;
                            /** @default  */
                            notes?: string;
                        };
                        effectiveFrom?: unknown;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/valuations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            items: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                            total: number;
                            page: number;
                            limit: number;
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "idempotency-key"?: string;
                };
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** Format: uuid */
                        investmentId: string;
                        amount: string;
                        date: string;
                        /** @default  */
                        notes?: string;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/valuations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        version: number;
                        data: {
                            /** Format: uuid */
                            investmentId: string;
                            amount: string;
                            date: string;
                            /** @default  */
                            notes?: string;
                        };
                        effectiveFrom?: unknown;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** Format: uuid */
                            id: string;
                            /** Format: uuid */
                            spaceId: string;
                            /** @enum {string} */
                            resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                            version: number;
                            /** Format: uuid */
                            createdBy: string;
                            /** Format: uuid */
                            updatedBy: string;
                            createdAt: string;
                            updatedAt: string;
                            /** Format: uuid */
                            recurrenceId: string | null;
                            data: {
                                name: string;
                                /** @default #16a34a */
                                color: string;
                                /**
                                 * @default ellipsis
                                 * @enum {string}
                                 */
                                icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                /** @default false */
                                archived: boolean;
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                dueDate: string;
                                /**
                                 * @default pending
                                 * @enum {string}
                                 */
                                status: "pending" | "confirmed" | "cancelled";
                                /** @default null */
                                effectiveDate: string | null;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                description: string;
                                amount: string;
                                /** Format: uuid */
                                categoryId: string;
                                /** @enum {string} */
                                type: "expense" | "income";
                                /** @enum {string} */
                                frequency: "daily" | "weekly" | "monthly" | "yearly";
                                /** @default 1 */
                                interval: number;
                                startDate: string;
                                /** @default null */
                                endDate: string | null;
                                /** @default false */
                                paused: boolean;
                                /** @default  */
                                notes: string;
                                /** @enum {string} */
                                icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                            } | {
                                name: string;
                                /** @enum {string} */
                                type: "investment" | "savings";
                                /** @default  */
                                institution: string;
                                /** @default 0 */
                                initialBalance: string;
                                startDate: string;
                                /** @default null */
                                goal: string | null;
                                /** @default null */
                                goalDate: string | null;
                                /**
                                 * @default other
                                 * @enum {string}
                                 */
                                product: "cdb" | "lci" | "lca" | "other";
                                /** @default false */
                                taxable: boolean;
                                /** @default 0 */
                                taxRate: number;
                                /** @default null */
                                expectedAnnualReturn: number | null;
                                /** @default null */
                                maturityDate: string | null;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                /** @enum {string} */
                                type: "deposit" | "withdrawal";
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            } | {
                                /** Format: uuid */
                                investmentId: string;
                                amount: string;
                                date: string;
                                /** @default  */
                                notes: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query: {
                    month: string;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            currency: string;
                            expenses: string | null;
                            incomes: string | null;
                            balance: string | null;
                            pendingExpenses: string | null;
                            pendingIncomes: string | null;
                            byCategory: {
                                /** Format: uuid */
                                id: string;
                                name: string;
                                color: string;
                                amount: string;
                            }[];
                            upcoming: {
                                /** Format: uuid */
                                id: string;
                                /** Format: uuid */
                                spaceId: string;
                                /** @enum {string} */
                                resource: "categories" | "expenses" | "incomes" | "recurrences" | "investments" | "movements" | "valuations";
                                version: number;
                                /** Format: uuid */
                                createdBy: string;
                                /** Format: uuid */
                                updatedBy: string;
                                createdAt: string;
                                updatedAt: string;
                                /** Format: uuid */
                                recurrenceId: string | null;
                                data: {
                                    name: string;
                                    /** @default #16a34a */
                                    color: string;
                                    /**
                                     * @default ellipsis
                                     * @enum {string}
                                     */
                                    icon: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                    /** @default false */
                                    archived: boolean;
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    dueDate: string;
                                    /**
                                     * @default pending
                                     * @enum {string}
                                     */
                                    status: "pending" | "confirmed" | "cancelled";
                                    /** @default null */
                                    effectiveDate: string | null;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    description: string;
                                    amount: string;
                                    /** Format: uuid */
                                    categoryId: string;
                                    /** @enum {string} */
                                    type: "expense" | "income";
                                    /** @enum {string} */
                                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                                    /** @default 1 */
                                    interval: number;
                                    startDate: string;
                                    /** @default null */
                                    endDate: string | null;
                                    /** @default false */
                                    paused: boolean;
                                    /** @default  */
                                    notes: string;
                                    /** @enum {string} */
                                    icon?: "house" | "utensils" | "car" | "heart-pulse" | "graduation-cap" | "party-popper" | "repeat" | "ellipsis" | "video" | "bot" | "music" | "piggy-bank" | "chart-no-axes-combined";
                                } | {
                                    name: string;
                                    /** @enum {string} */
                                    type: "investment" | "savings";
                                    /** @default  */
                                    institution: string;
                                    /** @default 0 */
                                    initialBalance: string;
                                    startDate: string;
                                    /** @default null */
                                    goal: string | null;
                                    /** @default null */
                                    goalDate: string | null;
                                    /**
                                     * @default other
                                     * @enum {string}
                                     */
                                    product: "cdb" | "lci" | "lca" | "other";
                                    /** @default false */
                                    taxable: boolean;
                                    /** @default 0 */
                                    taxRate: number;
                                    /** @default null */
                                    expectedAnnualReturn: number | null;
                                    /** @default null */
                                    maturityDate: string | null;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    /** @enum {string} */
                                    type: "deposit" | "withdrawal";
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                } | {
                                    /** Format: uuid */
                                    investmentId: string;
                                    amount: string;
                                    date: string;
                                    /** @default  */
                                    notes: string;
                                };
                            }[];
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/investments/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    spaceId: string;
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            current: string;
                            deposits: string;
                            withdrawals: string;
                            result: string;
                            progress: number | null;
                            history: {
                                current: string;
                                deposits: string;
                                withdrawals: string;
                                result: string;
                                progress: number | null;
                                date: string;
                            }[];
                            projection: {
                                maturityDate: string;
                                gross: string;
                                earnings: string;
                                tax: string;
                                net: string;
                            } | null;
                            forecast: {
                                date: string;
                                gross: string;
                                net: string;
                            }[];
                        };
                    };
                };
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/spaces/{spaceId}/audit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    from?: string;
                    to?: string;
                    categoryId?: string;
                    investmentId?: string;
                    status?: "pending" | "confirmed" | "cancelled";
                    page?: number;
                    limit?: number;
                };
                header?: never;
                path: {
                    spaceId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        active: boolean;
                    };
                };
            };
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/admin/users/{id}/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mcp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/openapi.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Default Response */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Default Response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
