import { User } from "discord.js";

const owners: String[] = ['881310086411190293']

function isOwner(user: User) {
    return owners.includes(user.id)
}


export default {
    isOwner
}