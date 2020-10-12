/**
 * Type: Helper
 * Name: uuid
 * Author: PVT
 * Role: make unique id
 * Version: 1.0.0
 */

const uuid = () => {
    return `xxxx-xxxx-xxxx-xxxxxxxxx-${Date.now()}`.replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    });
};
