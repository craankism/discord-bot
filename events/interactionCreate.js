const {
    Events,
    Collection,
    MessageFlags,
} = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        // modal
        if (interaction.isModalSubmit() && interaction.customId === 'myModal') {
            // Get the data entered by the user
            const titleInput = interaction.fields.getTextInputValue('titleInput');
            const dateInput = interaction.fields.getTextInputValue('dateInput');
            const timeInput = interaction.fields.getTextInputValue('timeInput');
            const locationInput = interaction.fields.getTextInputValue('locationInput');
            const descriptionInput = interaction.fields.getTextInputValue('descriptionInput');

            console.log({ titleInput, dateInput, timeInput, locationInput, descriptionInput });

            function formatDate(dateStr) {
                const [dd, mm, yyyy] = dateStr.split('.');
                return `${yyyy}${mm}${dd}`;
            }
            function formatTime(timeStr) {
                const [hh, mm] = timeStr.split(':');
                return `${hh}${mm}`;
            }

            // For todays date;
            Date.prototype.today = function () {
                return (this.getFullYear() + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "");
            }
            // For the time now
            Date.prototype.timeNow = function () {
                return ((this.getHours() < 10) ? "0" : "") + this.getHours() + "" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + "" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
            }

            const currentdate = new Date();
            const timestamp = currentdate.today() + 'T' + currentdate.timeNow() + 'Z';

            let timeStart = '';
            let timeEnd = '';
            if (timeInput.includes("-")) {
                const time = timeInput.split("-");
                timeStart = 'T' + formatTime(time[0]) + '00';
                timeEnd = 'T' + formatTime(time[1]) + '00';
            }

            let dateStart;
            let dateEnd;
            if (dateInput.includes("-")) {
                const date = dateInput.split("-");
                dateStart = formatDate(date[0]);
                dateEnd = formatDate(date[1]);
            } else {
                dateStart = formatDate(dateInput);
                dateEnd = formatDate(dateInput);
            }

            let location = locationInput
                .split(",")
                .map(part => part.trim())
                .join("\\, ");


            // respond with action row and button, it contains a downloadlink of the .ics file
            const icsText =
                `BEGIN:VCALENDAR\r\n` +
                `VERSION:2.0\r\n` +
                `PRODID:-//discord-bot//EN\r\n` +
                `CALSCALE:GREGORIAN\r\n` +
                `BEGIN:VEVENT\r\n` +
                `SUMMARY:${titleInput}\r\n` +
                `UID:${crypto.randomUUID()}\r\n` +
                `DTSTART:${dateStart + timeStart}\r\n` +
                `DTEND:${dateEnd + timeEnd}\r\n` +
                `DTSTAMP:${timestamp}\r\n` +
                `LOCATION:${location}\r\n` +
                `DESCRIPTION:${descriptionInput}\r\n` +
                `END:VEVENT\r\n` +
                `END:VCALENDAR`;
            // WORK IN PROGRESS https://icalendar.org/

            await interaction.reply({
                content: 'Event file below',
                files: [{
                    attachment: Buffer.from(icsText, 'utf8'),
                    name: 'event.ics'
                }],
            });

            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        const cooldowns = interaction.client.cooldowns ?? (interaction.client.cooldowns = new Collection());
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1_000);
                return interaction.reply({
                    content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};
