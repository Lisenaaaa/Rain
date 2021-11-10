import { container } from "@sapphire/pieces";
import { User } from "discord.js";

function isOwner(user: User) {
    return container.config.owners.includes(user.id)
}


export default {
    isOwner
}