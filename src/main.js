import "dotenv/config";
import { db } from "./database";
import { client } from "./discord/connection";
import { validateRA } from "./utils";

client.on("messageCreate", async (message) => {
  const { author, content } = message;
  const [code, RA] = content.split(" ");
  if (author.bot) return;

  if (code.startsWith("!verificar")) {
    if (!RA) return message.reply("Digite o número do seu RA. :pencil:");

    if (!validateRA(RA))
      return message.reply("Número de RA inválido ! :no_entry_sign:");

    const ra_number = Number(RA.replace("-", ""));
    const rows = await db("RAs")
      .select()
      .where({ ra_number: Number(ra_number) });

    if (rows.length) {
      return message.reply("Este RA já esta Verificado. :no_entry:");
    }

    await db("RAs").insert({ ra_number });

    message.reply(
      `${author} você está verificado com o RA ${RA} ! :white_check_mark:`
    );
  }
});