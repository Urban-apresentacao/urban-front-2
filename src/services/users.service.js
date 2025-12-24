import api from "./api";

export async function getAllUsers() {
    const {data} = await api.get("/users");
    return data;
}