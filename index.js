const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ================= CONFIGURAÇÃO DO BOT =================
const TOKEN = "MTUwNzkxOTA0MzEyMDg1NzEwOQ.GKQHG1.2WrR-UpjB7MHoCsc9k2-_e7hs_oS7bjg-IsFnE"; 
const GUILD_ID = "1506661685149302804";
// =======================================================

// Banco de dados temporário para as Keys VIP
const activeKeys = new Set();
const usedKeys = new Set();
const vipUsers = new Set();

client.once('ready', () => {
    console.log(`🤖 Bot online como ${client.user.tag}!`);
});

// Comando para os donos/admins gerarem Keys VIP
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Comando: !gerarkey
    if (message.content.toLowerCase() === '!gerarkey') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Apenas administradores podem gerar chaves VIP!');
        }

        const key = 'SENSI-VIP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        activeKeys.add(key);

        return message.reply(`🔑 **Nova Key VIP Gerada:** \`${key}\`\nEnvie para o cliente ativar no painel!`);
    }

    // Comando para enviar o Painel Principal no chat: !painel
    if (message.content.toLowerCase() === '!painel') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ Você não tem permissão para usar este comando.');
        }

        const embed = new EmbedBuilder()
            .setTitle('🎯 PAINEL DE SENSIBILIDADE - IPHONE VIP')
            .setDescription('Seja bem-vindo ao melhor sistema de ajustes para iOS!\n\n' +
                            '🔹 **Acesso Grátis:** Opções básicas de sensibilidade.\n' +
                            '👑 **Acesso VIP:** Gerador avançado, Regedit e atualizações exclusivas.')
            .setColor('#0099ff')
            .setImage('https://i.imgur.com/8QZ7r7x.png') // Imagem ilustrativa
            .setFooter({ text: 'Selecione uma opção abaixo para começar' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('btn_free')
                .setLabel('📱 Sensi Grátis')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('btn_vip_menu')
                .setLabel('👑 Recursos VIP')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('btn_activate_key')
                .setLabel('🔑 Ativar Key')
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

// Gerenciador de Botões e Modals
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() && !interaction.isModalSubmit()) return;

    // BOTÃO: Sensi Grátis
    if (interaction.customId === 'btn_free') {
        const embedFree = new EmbedBuilder()
            .setTitle('📱 Sensibilidade Base (Grátis)')
            .setDescription('Aqui está um ajuste padrão para testar:')
            .addFields(
                { name: 'Geral', value: '95', inline: true },
                { name: 'Ponto Vermelho', value: '88', inline: true },
                { name: 'Mira 2x / 4x', value: '92 / 85', inline: true },
                { name: 'DPI Recomendada', value: '550', inline: false }
            )
            .setColor('#cccccc');
        
        await interaction.reply({ embeds: [embedFree], ephemeral: true });
    }

    // BOTÃO: Menu VIP
    if (interaction.customId === 'btn_vip_menu') {
        if (!vipUsers.has(interaction.user.id)) {
            return interaction.reply({ content: '❌ Você precisa de acesso **VIP** para liberar este menu! Compre uma Key ou ative uma válida no painel.', ephemeral: true });
        }

        const embedVip = new EmbedBuilder()
            .setTitle('👑 PAINEL EXCLUSIVO IPHONE VIP')
            .setDescription('Sensibilidades updated e arquivos calibrados direto no servidor:')
            .addFields(
                { name: '🎯 Sensi InstaPlayer (iOS)', value: 'Geral: 100 | RedDot: 94 | 2x: 98 | 4x: 96', inline: false },
                { name: '⚙️ Ajustes de Sistema', value: 'Acesso Rápido: Ativado\nVelocidade do Cursor: Máxima (120Hz)', inline: false },
                { name: '📦 Regedit Mobile (.txt)', value: 'Ajuste interno para estabilizar a mira: `hit_registration=1` e `aim_lock_ios=true`', inline: false }
            )
            .setColor('#ffaa00');

        await interaction.reply({ embeds: [embedVip], ephemeral: true });
    }

    // BOTÃO: Abrir Formulário de Ativar Key
    if (interaction.customId === 'btn_activate_key') {
        const modal = new ModalBuilder()
            .setCustomId('modal_key')
            .setTitle('🔑 Ativação de Key VIP');

        const keyInput = new TextInputBuilder()
            .setCustomId('input_key_code')
            .setLabel('Digite seu código VIP abaixo:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('SENSI-VIP-XXXXXX');

        const firstRow = new ActionRowBuilder().addComponents(keyInput);
        modal.addComponents(firstRow);

        await interaction.showModal(modal);
    }

    // SUBMIT DO MODAL: Validação da Key
    if (interaction.isModalSubmit() && interaction.customId === 'modal_key') {
        const typedKey = interaction.fields.getTextInputValue('input_key_code').trim().toUpperCase();

        if (usedKeys.has(typedKey)) {
            return interaction.reply({ content: '❌ Essa Key já foi utilizada por outro usuário!', ephemeral: true });
        }

        if (activeKeys.has(typedKey)) {
            activeKeys.delete(typedKey);
            usedKeys.add(typedKey);
            vipUsers.add(interaction.user.id);

            return interaction.reply({ content: '🎉 **PARABÉNS!** Seu acesso **VIP** foi ativado com sucesso! Clique novamente no botão **Recursos VIP** para liberar suas funções.', ephemeral: true });
        } else {
            return interaction.reply({ content: '❌ Key inválida ou inexistente. Verifique se digitou corretamente.', ephemeral: true });
        }
    }
});

client.login(TOKEN);
