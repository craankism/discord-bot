const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    LabelBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Opens a sample modal'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('myModal')
            .setTitle('My Modal');

        const titleInput = new TextInputBuilder()
            .setCustomId('titleInput')
            .setLabel('Title')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Team Meeting')
            .setRequired(true);

        const dateInput = new TextInputBuilder()
            .setCustomId('dateInput')
            .setLabel('Date')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('2026-03-27')
            .setRequired(true);

        const timeInput = new TextInputBuilder()
            .setCustomId('timeInput')
            .setLabel('Time')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('18:30')
            .setRequired(true);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('descriptionInput')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('What is this about?')
            .setRequired(false);

        // const locationInput = new TextInputBuilder()
        //     .setCustomId('locationInput')
        //     .setLabel('Location')
        //     .setStyle(TextInputStyle.Short)
        //     .setPlaceholder('Discord VC / Address / Link')
        //     .setRequired(false);

        const favoriteStarterSelect = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Make a selection!')
            // Modal only property on select menus to prevent submission, defaults to true
            .setRequired(true)
            .addOptions(
                // String select menu options
                new StringSelectMenuOptionBuilder()
                    // Label displayed to user
                    .setLabel('Bulbasaur')
                    // Description of option
                    .setDescription('The dual-type Grass/Poison Seed Pokémon.')
                    // Value returned to you in modal submission
                    .setValue('bulbasaur'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Charmander')
                    .setDescription('The Fire-type Lizard Pokémon.')
                    .setValue('charmander'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Squirtle')
                    .setDescription('The Water-type Tiny Turtle Pokémon.')
                    .setValue('squirtle'),
            );
        const favoriteStarterLabel = new LabelBuilder()
            .setLabel("What's your favorite Gen 1 Pokémon starter?")
            // Set string select menu as component of the label
            .setStringSelectMenuComponent(favoriteStarterSelect);


        const titleRow = new ActionRowBuilder().addComponents(titleInput);
        const dateRow = new ActionRowBuilder().addComponents(dateInput);
        const timeRow = new ActionRowBuilder().addComponents(timeInput);
        modal.addLabelComponents(favoriteStarterLabel);
        const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);
        // const locationRow = new ActionRowBuilder().addComponents(locationInput);

        modal.addComponents(titleRow, dateRow, timeRow, descriptionRow);

        await interaction.showModal(modal);
        if (!interaction.isModalSubmit()) return;
        // console.log(interaction);
    },
};
