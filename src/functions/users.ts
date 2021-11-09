import { User } from "discord.js";

const owners: String[] = []

function isOwner(user: User) {
    return owners.includes(user.id)
}


export default {
    isOwner
}