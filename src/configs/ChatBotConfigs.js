import { Button } from 'react-chatbotify';
import { defaultImage } from '../utils/Constatns';
import cookie from 'react-cookies';

export const ChatBotFlow = {
   start: {
      message: () => {
         const seenBefore = cookie.load('user');
         if (seenBefore) {
            return `Chào mừng trở lại ${seenBefore?.data?.username}! Tôi có thể giúp gì cho bạn?`;
         }
         return 'Xin chào 👋! Tôi có thể giúp gì cho bạn?';
      },
   },
};

export const ChatBoxSettings = {
   tooltip: {
      mode: 'NEVER',
   },
   general: {
      primaryColor: '#009970',
      secondaryColor: '#009970',
      showFooter: false,
   },
   chatHistory: {
      viewChatHistoryButtonText: 'Tải tin nhắn trước đó ⟳',
      chatHistoryLineBreakText: '----- Tin nhắn trước đó -----',
   },
   chatInput: {
      enabledPlaceholderText: 'Nhập tin nhắn của bạn...',
      buttons: [Button.SEND_MESSAGE_BUTTON],
   },
   chatWindow: {
      messagePromptText: 'Tin nhắn mới ↓',
   },
   header: {
      title: (
         <div
            style={{ cursor: 'pointer', margin: 0, fontSize: 20, fontWeight: 'bold' }}
            onClick={() => window.open('https://github.com/HiepThanhTran/Website-SCMS')}
         >
            SCMS Harmony
         </div>
      ),
      showAvatar: true,
      avatar: defaultImage.USER_AVATAR,
      buttons: [Button.CLOSE_CHAT_BUTTON],
   },
   footer: {
      text: null,
      buttons: [Button.FILE_ATTACHMENT_BUTTON, Button.EMOJI_PICKER_BUTTON],
   },
};
