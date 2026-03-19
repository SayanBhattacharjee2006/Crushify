import { useCallback, useRef } from 'react'
import { getSocket } from '../services/socket.services';

function useTypingIndicator(conversationId) {
    const typingRef = useRef(false);
    const timeOutRef = useRef(null);

    const onTyping = useCallback(()=>{
        const socket = getSocket();

        if(!socket || !conversationId)return ;

        if(!typingRef.current){
            typingRef.current = true;
            socket.emit("typing_start", {conversationId});
        }

        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => {
            typingRef.current = false;
            socket.emit("typing_stop", {conversationId});
        },1500);

    },[conversationId])


  return {onTyping}
}

export default useTypingIndicator