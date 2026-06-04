import { client } from "../client/client.gen";

// Configure client with baseURL, auth, and the mock adapter directly
client.setConfig({
  baseURL: "http://localhost:3000",
  auth: () => localStorage.getItem("accessToken") ?? "",
//   adapter: async (config) => {
//     console.log("[Mock API] Intercepted request:", config.method?.toUpperCase(), config.url);

//     // Simulate network delay
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     const url = config.url || "";
//     const method = config.method?.toLowerCase();

//     // Check if login request
//     if (url.includes("/auth/login") && method === "post") {
//       let body: any = {};
//       try {
//         if (typeof config.data === "string") {
//           body = JSON.parse(config.data);
//         } else if (config.data) {
//           body = config.data;
//         }
//       } catch (e) {
//         console.error("[Mock API] Failed to parse request body:", e);
//       }

//       const email = body?.email || "";
//       const password = body?.password || "";

//       if (password === "wrongpass") {
//         console.log("[Mock API] Simulating unauthorized login failure");
//         return {
//           data: { message: "Invalid email or password" },
//           status: 401,
//           statusText: "Unauthorized",
//           headers: {},
//           config,
//         };
//       }

//       console.log("[Mock API] Simulating successful login for:", email);
//       return {
//         data: {
//           accessToken: "mocked-access-token-jwt-here",
//           user: {
//             id: "usr_mock123",
//             email: email,
//             roleId: 1,
//             status: "ACTIVE",
//           },
//         },
//         status: 200,
//         statusText: "OK",
//         headers: {},
//         config,
//       };
//     }

//     if (url.includes("/auth/register") && method === "post") {
//       let body: any = {};
//       try {
//         if (typeof config.data === "string") {
//           body = JSON.parse(config.data);
//         } else if (config.data) {
//           body = config.data;
//         }
//       } catch (e) {
//         console.error("[Mock API] Failed to parse request body:", e);
//       }

//       const email = body?.email || "";
//       const password = body?.password || "";

//       console.log("[Mock API] Simulating successful registration for:", email);
//       return {
//         data: {
//           user: {
//             id: "usr_mock123",
//             email: email,
//             status: "ACTIVE",
//           },
//         },
//         status: 201,
//         statusText: "Created",
//         headers: {},
//         config,
//       };
//     }

//     console.warn("[Mock API] Route not handled, returning 404:", url);
//     return {
//       data: { message: `Mock endpoint not implemented for ${method?.toUpperCase()} ${url}` },
//       status: 404,
//       statusText: "Not Found",
//       headers: {},
//       config,
//     };
//   }
});