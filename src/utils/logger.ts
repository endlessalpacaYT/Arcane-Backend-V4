function formatMessage(colorCode: number, label: string, ...args: any[]) {
    const msg = args.join(" ");
    console.log(`\x1b[${colorCode}m${label}\x1b[0m ${msg}`);
}

function backend(...args: any[]) {
    formatMessage(35, "[BACKEND]", ...args);  
}

function database(...args: any[]) {
    formatMessage(32, "[DATABASE]", ...args);  
}

function bot(...args: any[]) {
    formatMessage(33, "[BOT]", ...args);  
}

function xmpp(...args: any[]) {
    formatMessage(34, "[XMPP]", ...args);  
}

export default {
    formatMessage,
    backend,
    database,
    bot,
    xmpp
}