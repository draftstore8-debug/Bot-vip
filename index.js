const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ================= CONFIGURAÇÃO DO BOT =================
const TOKEN = "MTUwNzkxOTA0MzEyMDg1NzEwOQ.GpPE_w.86sD4bxQoUJy9R53AaXubmoH-H_68AjX3MJw0Y"; 
const GUILD_ID = "1506661685149302804";
// =======================================================

const activeKeys = new Set();
const usedKeys = new Set();
const vipUsers = new Set();

client.once('ready', () => {
    console.log(`🤖 Bot online como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!gerarkey') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Apenas administradores podem gerar chaves VIP!');
        }
        const key = 'SENSI-VIP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        activeKeys.add(key);
        return message.reply(`🔑 **Nova Key VIP Gerada:** \`${key}\``);
    }

    if (message.content.toLowerCase() === '!painel') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Você não tem permissão para usar este comando.');
        }

        const embed = new EmbedBuilder()
            .setTitle('🎯 PAINEL DE SENSIBILIDADE MULTIMARCAS VIP')
            .setDescription('Seja bem-vindo ao melhor sistema de ajustes mobile!\n\n' +
                            '🔹 **Acesso Grátis:** Opções básicas de sensibilidade.\n' +
                            '👑 **Acesso VIP:** Gerador para Todas as Marcas, Regedit e atualizações.')
            .setColor('#0099ff')
            .setFooter({ text: 'Selecione uma opção abaixo para começar' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_free').setLabel('📱 Sensi Grátis').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_vip_menu').setLabel('👑 Recursos VIP').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('btn_activate_key').setLabel('🔑 Ativar Key').setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    // BOTÃO: Sensi Grátis
    if (interaction.customId === 'btn_free') {
        const embedFree = new EmbedBuilder()
            .setTitle('📱 Sensibilidade Base (Grátis)')
            .setDescription('Ajuste padrão universal:\n\n' +
                            '• Geral: 95\n• Ponto Vermelho: 88\n• Mira 2x: 92\n• Mira 4x: 85\n• DPI: 510')
            .setColor('#cccccc');
        await interaction.reply({ embeds: [embedFree], ephemeral: true });
    }

    // BOTÃO: Menu VIP Principal (Abre as Marcas)
    if (interaction.customId === 'btn_vip_menu') {
        if (!vipUsers.has(interaction.user.id)) {
            return interaction.reply({ content: '❌ Você precisa de acesso **VIP** para liberar este menu!', ephemeral: true });
        }

        const embedMarcas = new EmbedBuilder()
            .setTitle('👑 MENU EXCLUSIVO VIP - SELECIONE SUA MARCA')
            .setDescription('Escolha a marca do seu celular para receber o painel de sensibilidade calibrado e o arquivo Regedit ideal:')
            .setColor('#ffaa00');

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vip_iphone').setLabel('🍏 iPhone (iOS)').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vip_samsung').setLabel('📱 Samsung').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vip_xiaomi').setLabel('📱 Xiaomi').setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vip_motorola').setLabel('📱 Motorola').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vip_infinix').setLabel('📱 Infinix / Outros').setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embedMarcas], components: [row1, row2], ephemeral: true });
    }

    // BOTÃO: Abrir Formulário de Ativar Key
    if (interaction.customId === 'btn_activate_key') {
        const modal = new ModalBuilder().setCustomId('modal_key').setTitle('🔑 Ativação de Key VIP');
        const keyInput = new TextInputBuilder()
            .setCustomId('input_key_code').setLabel('Digite seu código VIP abaixo:').setStyle(TextInputStyle.Short).setRequired(true).setPlaceholder('SENSI-VIP-XXXXXX');
        modal.addComponents(new ActionRowBuilder().addComponents(keyInput));
        await interaction.showModal(modal);
    }

    // SUBMIT DO MODAL: Validação da Key
    if (interaction.isModalSubmit() && interaction.customId === 'modal_key') {
        const typedKey = interaction.fields.getTextInputValue('input_key_code').trim().toUpperCase();
        if (usedKeys.has(typedKey)) return interaction.reply({ content: '❌ Essa Key já foi utilizada!', ephemeral: true });

        if (activeKeys.has(typedKey)) {
            activeKeys.delete(typedKey);
            usedKeys.add(typedKey);
            vipUsers.add(interaction.user.id);
            return interaction.reply({ content: '🎉 **VIP ATIVADO!** Clique em **Recursos VIP** para escolher sua marca.', ephemeral: true });
        } else {
            return interaction.reply({ content: '❌ Key inválida.', ephemeral: true });
        }
    }

    // ================= RESPOSTAS DE CADA MARCA VIP =================

    if (interaction.customId === 'vip_iphone') {
        const embed = new EmbedBuilder()
            .setTitle('🍏 SENSI IPHONE VIP')
            .setDescription('🎯 Geral: 100 | RedDot: 94 | 2x: 98 | 4x: 96\n⚙️ **Ajustes:** Cursor Móvel: 120 (Individual)\n📦 **Regedit iOS:** `aim_lock_ios=true`')
            .setColor('#ffffff');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'vip_samsung') {
        const embed = new EmbedBuilder()
            .setTitle('📱 SENSI SAMSUNG VIP')
            .setDescription('🎯 Geral: 98 | RedDot: 91 | 2x: 95 | 4x: 93\n⚙️ **Ajustes:** DPI: 720 | Velocidade do ponteiro: Máxima\n📦 **Regedit Android:** `sensibility_booster=1`')
            .setColor('#034ea2');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'vip_xiaomi') {
        const embed = new EmbedBuilder()
            .setTitle('📱 SENSI XIAOMI VIP')
            .setDescription('🎯 Geral: 97 | RedDot: 95 | 2x: 92 | 4x: 90\n⚙️ **Ajustes:** DPI: 680 | Game Turbo: Sensibilidade de toque no Máximo\n📦 **Regedit Android:** `touch_response=0.1ms`')
            .setColor('#ff6700');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'vip_motorola') {
        const embed = new EmbedBuilder()
            .setTitle('📱 SENSI MOTOROLA VIP')
            .setDescription('🎯 Geral: 100 | RedDot: 89 | 2x: 96 | 4x: 94\n⚙️ **Ajustes:** DPI: 580 | Tempo de permanência: Curto\n📦 **Regedit Android:** `perfect_hit_stabilizer=true`')
            .setColor('#00b5e2');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId === 'vip_infinix') {
        const embed = new EmbedBuilder()
            .setTitle('📱 SENSI INFINIX & OUTROS VIP')
            .setDescription('🎯 Geral: 99 | RedDot: 92 | 2x: 94 | 4x: 91\n⚙️ **Ajustes:** DPI: 600 | Atraso ao manter pressionado: Curto\n📦 **Regedit Universal:** `global_aim_assist=1`')
            .setColor('#4b0082');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

client.login(TOKEN);