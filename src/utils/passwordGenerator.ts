export const generatePassword = (length: number = 12): string =>{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    return Array(length).fill("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
}