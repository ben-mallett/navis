import { DiagnosticReturn } from '@/lib/utils';
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import io, { Socket } from 'socket.io-client';

type SocketContext = {
    socket: Socket | null;
};

const SocketContextImpl = createContext<SocketContext>({ socket: null });

function getSocket(domain: string, port: number) {
    const sio = io(`${domain}:${port}`);
    return sio;
}

/**
 * Triggers the given event with the given data on the given socket if available
 *
 * @param socket socket object to emit on
 * @param event name of event to emit
 * @param data data to emit to event
 */
export function triggerSocketEvent(
    socket: any,
    event: string,
    data: any
): DiagnosticReturn {
    if (socket && socket.connected) {
        data === undefined ? socket.emit(event) : socket.emit(event, data);
        return {
            error: false,
            message: 'Emitted socket event',
            data: undefined,
        };
    } else {
        return {
            error: true,
            message: 'Failed to emit event' + event,
            data: undefined,
        };
    }
}

type SocketProviderProps = {
    ip: string;
    port: number;
    children: ReactNode;
};

export function TankSocketProvider(props: SocketProviderProps) {
    const { ip, port, children } = props;
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = getSocket(ip, port);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [ip, port]);

    return (
        <SocketContextImpl.Provider value={{ socket }}>
            {children}
        </SocketContextImpl.Provider>
    );
}

export const useSocket = (): SocketContext => {
    return useContext(SocketContextImpl);
};

export default SocketContextImpl;
