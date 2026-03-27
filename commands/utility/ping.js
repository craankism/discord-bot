const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', withResponse: true });
		interaction.editReply(`Roundtrip latency: ${sent.resource.message.createdTimestamp - interaction.createdTimestamp}ms`);
		// await interaction.reply({ content: 'Pong!', flags: MessageFlags.Ephemeral });
		// wait interaction.followUp('Pong again!');
		// await interaction.deferReply(); 
		// await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		// // you can do things that take time here (database queries, api requests, ...) that you need for the initial response
		// // you can take up to 15 minutes, then the interaction token becomes invalid!
		// await interaction.editReply('Pong!'); 

		// await interaction.reply('Pong!');
		// const message = await interaction.fetchReply();
		// console.log(message);

	},
};