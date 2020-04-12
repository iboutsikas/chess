import { ChessBlock } from './ChessBlock';

export interface CommandReply {
    command: string;
    reply: string;
    state: ChessBlock[];
};