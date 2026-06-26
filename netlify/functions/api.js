require("dotenv").config();

const serverless = require("serverless-http");
const app = require("../../app.js");

const handler = serverless(app, {
    binary: ["multipart/form-data", "image/*"]
});

module.exports.handler = async (event, context) => {
    // Get the request Content-Type header
    const contentType = (
        event.headers["content-type"] ||
        event.headers["Content-Type"] ||
        ""
    ).toLowerCase();

    console.log("[DEBUG] Netlify Handler Invoked:", {
        path: event.path,
        httpMethod: event.httpMethod,
        contentType: contentType,
        isBase64Encoded: event.isBase64Encoded,
        hasBody: !!event.body,
        bodyPreview: event.body ? event.body.substring(0, 100) : "empty"
    });

    // Decode the base64 body if it is text/urlencoded/json
    if (event.isBase64Encoded && event.body) {
        const isTextLike = 
            contentType.includes("application/x-www-form-urlencoded") ||
            contentType.includes("application/json") ||
            contentType.includes("text/");

        console.log("[DEBUG] Content-Type Check:", { isTextLike });

        if (isTextLike) {
            try {
                const decoded = Buffer.from(event.body, "base64").toString("utf8");
                console.log("[DEBUG] Decoded Body successfully, preview:", decoded.substring(0, 100));
                event.body = decoded;
                event.isBase64Encoded = false;
            } catch (err) {
                console.error("[DEBUG] Base64 decoding failed:", err.message);
            }
        }
    }

    return handler(event, context);
};
