"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatMessage(colorCode, label, ...args) {
    const msg = args.join(" ");
    console.log(`\x1b[${colorCode}m${label}\x1b[0m ${msg}`);
}
function backend(...args) {
    formatMessage(35, "[BACKEND]", ...args);
}
function database(...args) {
    formatMessage(32, "[DATABASE]", ...args);
}
function bot(...args) {
    formatMessage(33, "[BOT]", ...args);
}
function xmpp(...args) {
    formatMessage(34, "[XMPP]", ...args);
}
exports.default = {
    formatMessage,
    backend,
    database,
    bot,
    xmpp
};
