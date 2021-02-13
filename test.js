#!/usr/bin/env node
/* eslint-disable camelcase */
const { MTProto, getSRPParams } = require('@mtproto/core');
const prompts = require('prompts');
const { isEmpty } = require('lodash');
const app = require('./app.js');

const api_id = process.env.TELEGRAM_API_ID;
const api_hash = process.env.TELEGRAM_API_HASH;
const teleblogChannel = {
  id: -1001003399994,
  username: 'teleblog',
  access_hash: 4872913646325428232,
};
const channelsMapping = {
  1113089107: 'Юности, 13к1',
  1101264208: 'ЖК Люберецкий, общий @luberecki_common',
  1356825457: 'Новости ЖК Люберецкий @luberecki',
  1241034426: 'Обозреватель БПЛА @dronesrussia',
  1054900891: 'Telegram IT Job @myjobit',
  1052346215: 'Job in IT&Digital @newhr',
  1360339320: 'Курсы от Яндекса @YandexCourse',
  1307913142: 'Полный беспилот @polnybespilot',
  1049429585: 'Вакансии на Джинне @djinni_jobs_bot',
  1365245663: 'GetMeIT @GetMeIT_bot',
  1092674389: 'GetIT Russia @Getitrussia',
};

async function getPhone() {
  return (await prompts({
    type: 'text',
    name: 'phone',
    message: 'Enter your phone number:',
  })).phone;
}

async function getCode() {
  // you can implement your code fetching strategy here
  return (await prompts({
    type: 'text',
    name: 'code',
    message: 'Enter the code sent:',
  })).code;
}

async function getPassword() {
  return (await prompts({
    type: 'text',
    name: 'password',
    message: 'Enter Password:',
  })).password;
}

const mtproto = new MTProto({
  api_id,
  api_hash,
});

function startListener() {
  console.log('[+] starting listener');
  try {
    mtproto.updates.on('updates', (data) => {
      const { updates } = data;
      const newMessages = updates
        .filter((update) => update._ === 'updateNewChannelMessage' || update._ === 'updateServiceNotification')
        .map(({ message }) => message);
      const messagesArray = newMessages.map(({
        date,
        message,
        entities,
        peer_id,
      }) => {
        const formattedDate = date ? app.formatDate(date * 1000) : null;
        const channel = channelsMapping[peer_id.channel_id] || peer_id.channel_id;
        const result = {
          channel,
          date: formattedDate,
          title: message,
        };
        if (!isEmpty(entities)) {
          const [url] = entities
            .filter((entity) => entity._ === 'messageEntityTextUrl')
            .map((entity) => entity.url);
          if (url) {
            result.url = url;
          }
        }
        return result;
      });
      if (!isEmpty(messagesArray)) {
        console.log('=============================');
        console.log(messagesArray);
      }
    });
  } catch (error) {
    console.error('Something is wrong with the updates handler...');
    process.exit(1);
  }
}

const getUserCountryCode = () => mtproto
  .call('help.getNearestDc')
  .then((result) => {
    console.log('country:', result.country);
  })
  .catch((error) => {
    console.error('There was an error during getting the user counrty code: ', error.message);
    process.exit(1);
  });

const getChannelInfo = (username) => mtproto
  .call('contacts.resolveUsername', { username })
  .then(({ chats }) => chats.forEach((chat) => {
    const { id, access_hash, title } = chat;
    console.log('Chat title: ', title);
    console.log('Chat ID: ', id);
    console.log('Chat access hash: ', access_hash);
  }))
  .catch(() => console.error('Smth went wrong when getting info about the channel: ', username));

const getFullChannel = (channel_id, access_hash) => {
  const parameters = {
    channel: {
      _: 'inputChannel',
      channel_id,
      access_hash,
    },
  };
  return mtproto
    .call('channels.getFullChannel', parameters)
    .then((result) => console.log(result))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
};

const getMessagesFromChat = (chat_id, limit) => {
  const parameters = {
    peer: {
      _: 'inputPeerChat',
      chat_id,
    },
    limit,
  };
  return mtproto
    .call('messages.getHistory', parameters)
    .then((result) => console.log(result))
    .catch((error) => {
      console.error('Error during getting the chat history: ', error.message);
      process.exit(1);
    });
};

mtproto
  .call('users.getFullUser', {
    id: {
      _: 'inputUserSelf',
    },
  })
  .then(startListener())
  .catch(async (error) => {
    // The user is not logged in
    console.log('[+] You must log in');
    const phone_number = await getPhone();

    mtproto.call('auth.sendCode', {
      phone_number,
      settings: {
        _: 'codeSettings',
      },
    })
      .catch((error) => {
        if (error.error_message.includes('_MIGRATE_')) {
          const [type, nextDcId] = error.error_message.split('_MIGRATE_');

          mtproto.setDefaultDc(+nextDcId);

          return sendCode(phone_number);
        }
      })
      .then(async (result) => mtproto.call('auth.signIn', {
        phone_code: await getCode(),
        phone_number,
        phone_code_hash: result.phone_code_hash,
      }))
      .catch((error) => {
        if (error.error_message === 'SESSION_PASSWORD_NEEDED') {
          return mtproto.call('account.getPassword').then(async (result) => {
            const { srp_id, current_algo, srp_B } = result;
            const {
              salt1, salt2, g, p,
            } = current_algo;

            const { A, M1 } = await getSRPParams({
              g,
              p,
              salt1,
              salt2,
              gB: srp_B,
              password: await getPassword(),
            });

            return mtproto.call('auth.checkPassword', {
              password: {
                _: 'inputCheckPasswordSRP',
                srp_id,
                A,
                M1,
              },
            });
          });
        }
      })
      .then((result) => {
        console.log('[+] successfully authenticated');
        // start listener since the user has logged in now
        startListener();
      });
  });

// mtproto.call('auth.logOut');
