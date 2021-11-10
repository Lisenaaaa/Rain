import { User } from "discord.js";
import client from "../index";

function isOwner(user: User) {
    return client.owners.includes(user.id)
}


export default {
    isOwner
}