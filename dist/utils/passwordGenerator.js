export const generatePassword = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    return Array(length).fill("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
};
//# sourceMappingURL=passwordGenerator.js.map