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

    // Decode the base64 body if it is text/urlencoded/json
    if (event.isBase64Encoded && event.body) {
        const isTextLike = 
            contentType.includes("application/x-www-form-urlencoded") ||
            contentType.includes("application/json") ||
            contentType.includes("text/");

        if (isTextLike) {
            event.body = Buffer.from(event.body, "base64").toString("utf8");
            event.isBase64Encoded = false;
        }
    }

    return handler(event, context);
};
