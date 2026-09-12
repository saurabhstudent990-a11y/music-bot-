const { 
  SlashCommandBuilder, 
  ContainerBuilder, 
  TextDisplayBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  SeparatorSpacingSize
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Shows information about SauraXT Music"),
  
  async execute(interaction) {
    const client = interaction.client;
    const container = new ContainerBuilder();

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# About SauraXT Music`
      )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**SauraXT Music** - A professional Discord music bot designed to bring high-quality music streaming to your server. Enjoy seamless playback, custom playlists, and a rich set of features to enhance your listening experience.`
      )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Key Features**\nHigh-quality music streaming\nCustom playlists & favorites\nAdvanced audio filters\nQueue management\nLyrics support\nSpotify integration`
      )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Built With**\nDiscord.js v14\nNode.js\nLavalink\nSQLite Database`
      )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL("https://imgs.search.brave.com/8xRwYYZ6NLPeuJ0KYvMOWyFME_ktfqrxonjNL6DkCp0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2ViLzMw/LzcwL2ViMzA3MDNh/YjFkZTY3ZjZjOGM5/OGJkYzE3NjRlMWI3/LmpwZw")
      )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `*Engineered with ❤️ for SauraXT*`
      )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );

    container.addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=303600576574&scope=bot%20applications.commands`)
          .setLabel(`Invite Bot`)
          .setStyle(ButtonStyle.Link)
      )
    );

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  }
};

/*
 * Project: SauraXT Music
 * Author: SauraXT
 * License: MIT
 * © 2026 SauraXT Music. All rights reserved.
 */
