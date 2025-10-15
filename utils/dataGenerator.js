export function generateRandomUsername() {
    const randomNum = Math.floor(Math.random() * 100000);
    return `user${randomNum}`;
}