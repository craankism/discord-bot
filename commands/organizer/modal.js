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
        .setName('calendar')
        .setDescription('creates a calendar .ics file'),

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
            .setPlaceholder('30-03-2026')
            .setRequired(true);

        const timeInput = new TextInputBuilder()
            .setCustomId('timeInput')
            .setLabel('Time')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('18:30 (Leave emtpy for whole all-day')
            .setRequired(false);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('descriptionInput')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('What is this about?')
            .setRequired(false);

        const favoriteStarterSelect = new StringSelectMenuBuilder()
            .setCustomId('type')
            .setPlaceholder('Make a selection!')
            // Modal only property on select menus to prevent submission, defaults to true
            .setRequired(true)
            .addOptions(
                // String select menu options
                new StringSelectMenuOptionBuilder()
                    // Label displayed to user
                    .setLabel('Event')
                    // Description of option
                    //.setDescription('The dual-type Grass/Poison Seed Pokémon.')
                    // Value returned to you in modal submission
                    .setValue('VEVENT'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Task')
                    //.setDescription('The Fire-type Lizard Pokémon.')
                    .setValue('VTODO'),
            );
        const favoriteStarterLabel = new LabelBuilder()
            .setLabel("Type")
            // Set string select menu as component of the label
            .setStringSelectMenuComponent(favoriteStarterSelect);


        const titleRow = new ActionRowBuilder().addComponents(titleInput);
        const dateRow = new ActionRowBuilder().addComponents(dateInput);
        const timeRow = new ActionRowBuilder().addComponents(timeInput);
        modal.addLabelComponents(favoriteStarterLabel);
        const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);

        modal.addComponents(titleRow, dateRow, timeRow, descriptionRow);

        await interaction.showModal(modal);
        return;

    },
};
